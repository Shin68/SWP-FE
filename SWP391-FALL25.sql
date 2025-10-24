create database swp391_fall25;

use swp391_fall25;

-- USERS
CREATE TABLE Users (
    id BIGINT IDENTITY PRIMARY KEY,
    phone NVARCHAR(20) NOT NULL,
    password NVARCHAR(255) NOT NULL,
    fullname NVARCHAR(255) NOT NULL,
    email NVARCHAR(255),
    role NVARCHAR(50) CHECK (role IN ('CUSTOMER', 'TECHNICIAN', 'STAFF', 'ADMIN')),
    address nvarchar(255),
	dob DateTime
);

-- VEHICLE
CREATE TABLE Vehicle (
    id BIGINT IDENTITY PRIMARY KEY,
    vin NVARCHAR(50) UNIQUE,
    license_plate NVARCHAR(50) UNIQUE,
    brand NVARCHAR(100),
    model NVARCHAR(100),
    year INT,
    odometer NVARCHAR(50),
    customer_id BIGINT NOT NULL,
    CONSTRAINT FK_Vehicle_User FOREIGN KEY (customer_id) REFERENCES Users(id)
);

-- SERVICE CENTER
CREATE TABLE ServiceCenter (
    id BIGINT IDENTITY PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    location NVARCHAR(255),
    contactNumber NVARCHAR(50)
);

-- SERVICE APPOINTMENT
CREATE TABLE ServiceAppointment (
    id BIGINT IDENTITY PRIMARY KEY,
    appointmentDate DATE NOT NULL,
    appointmentTime NVARCHAR(50),
    technicianAssigned NVARCHAR(255),
    vehicle_id BIGINT NOT NULL,
    service_center_id BIGINT NOT NULL,
    CONSTRAINT FK_ServiceAppointment_Vehicle FOREIGN KEY (vehicle_id) REFERENCES Vehicle(id),
    CONSTRAINT FK_ServiceAppointment_ServiceCenter FOREIGN KEY (service_center_id) REFERENCES ServiceCenter(id)
);

-- PAYMENT
CREATE TABLE Payment (
    id BIGINT IDENTITY PRIMARY KEY,
    amount FLOAT NOT NULL,
    paymentMethod NVARCHAR(50) CHECK (paymentMethod IN ('CASH', 'VNPAY', 'QR', 'CARD')),
    status NVARCHAR(50) CHECK (status IN ('PENDING', 'PAID', 'FAILED')),
    appointment_id BIGINT UNIQUE NOT NULL,
    CONSTRAINT FK_Payment_ServiceAppointment FOREIGN KEY (appointment_id) REFERENCES ServiceAppointment(id)
);

-- SERVICE REPORT
CREATE TABLE ServiceReport (
    id BIGINT IDENTITY PRIMARY KEY,
    reportDate DATE NOT NULL,
    appointment_id BIGINT UNIQUE NOT NULL,
    CONSTRAINT FK_ServiceReport_ServiceAppointment FOREIGN KEY (appointment_id) REFERENCES ServiceAppointment(id)
);

-- PART TYPE
CREATE TABLE PartType (
    id BIGINT IDENTITY PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    partNumber NVARCHAR(100) UNIQUE
);

-- MAINTENANCE PLAN
CREATE TABLE MaintenancePlan (
    id BIGINT IDENTITY PRIMARY KEY,
    intervalKm INT,
    intervalMonths INT
);

-- MAINTENANCE PLAN ITEM
CREATE TABLE MaintenancePlanItem (
    id BIGINT IDENTITY PRIMARY KEY,
    taskName NVARCHAR(255) NOT NULL,
    partType NVARCHAR(255),
    maintenance_plan_id BIGINT NOT NULL,
    CONSTRAINT FK_MaintenancePlanItem_MaintenancePlan FOREIGN KEY (maintenance_plan_id) REFERENCES MaintenancePlan(id)
);

-- PART
CREATE TABLE Part (
    id BIGINT IDENTITY PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    price FLOAT,
    quantity INT,
    part_type_id BIGINT,
    vehicle_id BIGINT,
    CONSTRAINT FK_Part_PartType FOREIGN KEY (part_type_id) REFERENCES PartType(id),
    CONSTRAINT FK_Part_Vehicle FOREIGN KEY (vehicle_id) REFERENCES Vehicle(id)
);

-- SERVICE REPORT DETAILS
CREATE TABLE ServiceReportDetails (
    id BIGINT IDENTITY PRIMARY KEY,
    service NVARCHAR(255),
	actionType nvarchar(255),
	conditionStatus nvarchar(255),
	laborCost float,
	partCost float,
    totalCost FLOAT,
    report_id BIGINT NOT NULL,
    part_id BIGINT,
    maintenance_plan_item_id BIGINT,
    CONSTRAINT FK_ServiceReportDetails_Report FOREIGN KEY (report_id) REFERENCES ServiceReport(id),
    CONSTRAINT FK_ServiceReportDetails_Part FOREIGN KEY (part_id) REFERENCES Part(id),
    CONSTRAINT FK_ServiceReportDetails_MaintenancePlanItem FOREIGN KEY (maintenance_plan_item_id) REFERENCES MaintenancePlanItem(id)
);



-- REMINDER 
CREATE TABLE Reminder (
    id BIGINT IDENTITY PRIMARY KEY,
    reminderDate DATE NOT NULL,
    status NVARCHAR(50) CHECK (status IN ('PENDING', 'DONE', 'MISSED')),
    vehicle_id BIGINT NOT NULL,
    maintenance_plan_id BIGINT NOT NULL,
    CONSTRAINT FK_Reminder_Vehicle FOREIGN KEY (vehicle_id) REFERENCES Vehicle(id),
    CONSTRAINT FK_Reminder_MaintenancePlan FOREIGN KEY (maintenance_plan_id) REFERENCES MaintenancePlan(id)
);

Insert into Users(phone,password,fullname,email,role,address,dob) values('123456789','$2a$10$0U2olioTsfUMOPTfkOSkv.20XrN0BTQKkhvaOsDm/seemiq9LUlCG','nothing','noname@gmail.com','CUSTOMER','14 ba trieu',2025-04-16)
Insert into Users(phone,password,fullname,email,role,address,dob) values('987654321','$2a$10$JWxc.CzX54HG0jyg36JeT.XcmhqemgZFzWXp1pjyd.0vdAluPf6La','Nguyen Quang Hai','something@gmail.com','ADMIN','36 ngo gia tu',2004-11-12)
Insert into Users(phone,password,fullname,email,role,address,dob) values('741852963','$2a$10$Yede9IHfByeSbTBOeGn4YOALA9bXBRkMX0DgMXlGjhGbcUIYdKju.','something','hello890@gmail.com','STAFF','83 yersin',2001-06-14)
Insert into Users(phone,password,fullname,email,role,address,dob) values('963852741','$2a$10$oclV3aiSAZkrh3MbsnffzuIe5iac1eyA2uy5e7JEwkVtF.xXDGDRa','Ngo Gia Bao','ngogiabao890@gmail.com','TECHNICIAN','63 hai ba trung',2000-12-12)

Insert into Vehicle(vin,license_plate,brand,model,odometer,year,customer_id) values('7J3ZZ56T7834500003','63N263459','Honda','Air Blade',120000,12,1)


Insert into MaintenancePlan(intervalKm,intervalMonths) values(1,1)
Insert into MaintenancePlan(intervalKm,intervalMonths) values(5,6)
Insert into MaintenancePlan(intervalKm,intervalMonths) values(10,12)
Insert into MaintenancePlan(intervalKm,intervalMonths) values(15,18)
Insert into MaintenancePlan(intervalKm,intervalMonths) values(20,24)
Insert into MaintenancePlan(intervalKm,intervalMonths) values(25,30)
Insert into MaintenancePlan(intervalKm,intervalMonths) values(30,36)
Insert into MaintenancePlan(intervalKm,intervalMonths) values(35,42)
Insert into MaintenancePlan(intervalKm,intervalMonths) values(40,48)
Insert into MaintenancePlan(intervalKm,intervalMonths) values(45,54)
Insert into MaintenancePlan(intervalKm,intervalMonths) values(50,60)

insert into ServiceCenter(name,location,contactNumber) values('Nguyễn Motocare','434/5 Phạm Văn Chiêu, P.9, Gò Vấp, Tp. HCM',0962826298)
insert into ServiceCenter(name,location,contactNumber) values('Shop2banh','P.Phú Thọ Hòa, Q.Tân Phú, Tp.HCM',0938826348)
insert into ServiceCenter(name,location,contactNumber) values('Showroom Vin3S Nhà Bè','2250 Huỳnh Tấn Phát, Xã Phú Xuân, Huyện Nhà Bè, Thành phố Hồ Chí Minh',0946143939)
insert into ServiceCenter(name,location,contactNumber) values('Showroom Vin3S Lê Quang Định','486 Lê Quang Định, P. 11, Bình Thạnh, Hồ Chí Minh',0796553553)
insert into ServiceCenter(name,location,contactNumber) values('VinFast Lê Văn Việt','Tầng 1, TTTM Vincom Plaza Lê Văn Việt, 50 Lê Văn Việt, Phường Hiệp Phú, Quận 9, TP. Hồ Chí Minh',0981335517)
insert into ServiceCenter(name,location,contactNumber) values('VinFast Thảo Điền','Tầng L1, TTTM Vincom Mega Mall Thảo Điền, 159 Xa lộ Hà Nội, Phường Thảo Điền, Quận 2, TP. Hồ Chí Minh',0981335514)

insert into PartType(name,partNumber) values('Dau phanh','06405-MY5-P00')
insert into PartType(name,partNumber) values('Loc gio','37820-RRH-U63')
insert into PartType(name,partNumber) values('Loc dau','06430-GGZ-J00')
insert into PartType(name,partNumber) values('Bugi','06435-MAX-006')
insert into PartType(name,partNumber) values('Ma phanh truoc','06451-MCZ-006')
insert into PartType(name,partNumber) values('Lop xe truoc','05319-HMT-008')
insert into PartType(name,partNumber) values('Lop xe sau','95012-13001')
insert into PartType(name,partNumber) values('Ac quy','90306GE1004')

insert into Part(name,price,quantity,part_type_id) values('Dau phanh DOT 4',150,30,1)
insert into Part(name,price,quantity,part_type_id) values('Loc gio Honda',120,50,2)
insert into Part(name,price,quantity,part_type_id) values('Loc dau Yamada',130,40,3)
insert into Part(name,price,quantity,part_type_id) values('Bugi NGK CR7HSA',90,60,4)
insert into Part(name,price,quantity,part_type_id) values('Ma phanh truoc xe tay ga',250,25,5)
insert into Part(name,price,quantity,part_type_id) values('Lop xe truoc 80/90-14',400,15,6)
insert into Part(name,price,quantity,part_type_id) values('Lop xe sau 90/90-14',450000,10,7)
insert into Part(name,price,quantity,part_type_id) values('Ac quy GS 12V-5Ah',150000,30,1)

-- MỐC 1.000 km / 1 tháng
INSERT INTO MaintenancePlanItem (partType, taskName, maintenance_plan_id) VALUES ('Dau dong co', 'Thay the dau boi tron', 1);
INSERT INTO MaintenancePlanItem (partType, taskName, maintenance_plan_id) VALUES ('Phanh', 'Kiem tra bo thang', 1);
INSERT INTO MaintenancePlanItem (partType, taskName, maintenance_plan_id) VALUES ('Lop xe', 'Kiem tra ap suat va mon', 1);
INSERT INTO MaintenancePlanItem (partType, taskName, maintenance_plan_id) VALUES ('Ac quy', 'Kiem tra tinh trang phat', 1);

-- MỐC 5.000 km / 6 tháng
INSERT INTO MaintenancePlanItem (partType, taskName, maintenance_plan_id) VALUES ('Loc gio', 'Ve sinh hoac thay the', 2);
INSERT INTO MaintenancePlanItem (partType, taskName, maintenance_plan_id) VALUES ('Phanh', 'Lam sach ma phanh', 2);
INSERT INTO MaintenancePlanItem (partType, taskName, maintenance_plan_id) VALUES ('Dau phanh', 'Kiem tra muc dau', 2);
INSERT INTO MaintenancePlanItem (partType, taskName, maintenance_plan_id) VALUES ('Ac quy', 'Kiem tra dien ap', 2);

-- MỐC 10.000 km / 12 tháng
INSERT INTO MaintenancePlanItem (partType, taskName, maintenance_plan_id) VALUES ('Day curoa truyen dong', 'Kiem tra va can chinh', 3);
INSERT INTO MaintenancePlanItem (partType, taskName, maintenance_plan_id) VALUES ('He thong den', 'Kiem tra toan bo', 3);
INSERT INTO MaintenancePlanItem (partType, taskName, maintenance_plan_id) VALUES ('Lop xe', 'Dao lop', 3);
INSERT INTO MaintenancePlanItem (partType, taskName, maintenance_plan_id) VALUES ('Ac quy', 'Bao duong dien cuc', 3);

-- MỐC 15.000 km / 18 tháng
INSERT INTO MaintenancePlanItem (partType, taskName, maintenance_plan_id) VALUES ('Dau hop so', 'Thay the', 4);
INSERT INTO MaintenancePlanItem (partType, taskName, maintenance_plan_id) VALUES ('Phanh', 'Kiem tra dia phanh', 4);
INSERT INTO MaintenancePlanItem (partType, taskName, maintenance_plan_id) VALUES ('He thong treo', 'Kiem tra cao su giam chan', 4);
INSERT INTO MaintenancePlanItem (partType, taskName, maintenance_plan_id) VALUES ('Loc gio', 'Thay the moi', 4);

-- MỐC 20.000 km / 24 tháng
INSERT INTO MaintenancePlanItem (partType, taskName, maintenance_plan_id) VALUES ('Ac quy', 'Do dung luong va thay neu yeu', 5);
INSERT INTO MaintenancePlanItem (partType, taskName, maintenance_plan_id) VALUES ('Dau phanh', 'Thay moi', 5);
INSERT INTO MaintenancePlanItem (partType, taskName, maintenance_plan_id) VALUES ('He thong lai', 'Kiem tra khop noi', 5);
INSERT INTO MaintenancePlanItem (partType, taskName, maintenance_plan_id) VALUES ('He thong dien', 'Kiem tra cap sac', 5);

-- MỐC 25.000 km / 30 tháng
INSERT INTO MaintenancePlanItem (partType, taskName, maintenance_plan_id) VALUES ('Lop xe', 'Thay moi neu mon', 6);
INSERT INTO MaintenancePlanItem (partType, taskName, maintenance_plan_id) VALUES ('Phanh', 'Thay ma phanh', 6);
INSERT INTO MaintenancePlanItem (partType, taskName, maintenance_plan_id) VALUES ('Ac quy', 'Can bang cell pin', 6);
INSERT INTO MaintenancePlanItem (partType, taskName, maintenance_plan_id) VALUES ('He thong dien', 'Kiem tra relay nguon', 6);

-- MỐC 30.000 km / 36 tháng
INSERT INTO MaintenancePlanItem (partType, taskName, maintenance_plan_id) VALUES ('Dau hop so', 'Thay the', 7);
INSERT INTO MaintenancePlanItem (partType, taskName, maintenance_plan_id) VALUES ('He thong lam mat pin', 'Ve sinh bo tan nhiet', 7);
INSERT INTO MaintenancePlanItem (partType, taskName, maintenance_plan_id) VALUES ('Phanh', 'Kiem tra ABS', 7);
INSERT INTO MaintenancePlanItem (partType, taskName, maintenance_plan_id) VALUES ('He thong dien', 'Kiem tra cam bien', 7);

-- MỐC 35.000 km / 42 tháng
INSERT INTO MaintenancePlanItem (partType, taskName, maintenance_plan_id) VALUES ('Loc gio', 'Thay moi', 8);
INSERT INTO MaintenancePlanItem (partType, taskName, maintenance_plan_id) VALUES ('He thong lai', 'Bao duong rotuyn', 8);
INSERT INTO MaintenancePlanItem (partType, taskName, maintenance_plan_id) VALUES ('He thong phanh', 'Kiem tra ong dau va ong dan', 8);
INSERT INTO MaintenancePlanItem (partType, taskName, maintenance_plan_id) VALUES ('Ac quy', 'Do dien tro noi', 8);

-- MỐC 40.000 km / 48 tháng
INSERT INTO MaintenancePlanItem (partType, taskName, maintenance_plan_id) VALUES ('He thong dien', 'Kiem tra ECU', 9);
INSERT INTO MaintenancePlanItem (partType, taskName, maintenance_plan_id) VALUES ('Lop xe', 'Thay moi', 9);
INSERT INTO MaintenancePlanItem (partType, taskName, maintenance_plan_id) VALUES ('He thong treo', 'Kiem tra giam xoc', 9);
INSERT INTO MaintenancePlanItem (partType, taskName, maintenance_plan_id) VALUES ('Phanh', 'Thay dau phanh', 9);

-- MỐC 45.000 km / 54 tháng
INSERT INTO MaintenancePlanItem (partType, taskName, maintenance_plan_id) VALUES ('Ac quy', 'Kiem tra dong sac/xa', 10);
INSERT INTO MaintenancePlanItem (partType, taskName, maintenance_plan_id) VALUES ('He thong lam mat', 'Thay dung dich lam mat', 10);
INSERT INTO MaintenancePlanItem (partType, taskName, maintenance_plan_id) VALUES ('He thong lai', 'Can chinh thuoc lai', 10);
INSERT INTO MaintenancePlanItem (partType, taskName, maintenance_plan_id) VALUES ('Phanh', 'Kiem tra he thong ABS', 10);

-- MỐC 50.000 km / 60 tháng
INSERT INTO MaintenancePlanItem (partType, taskName, maintenance_plan_id) VALUES ('Ac quy', 'Thay the neu yeu', 11);
INSERT INTO MaintenancePlanItem (partType, taskName, maintenance_plan_id) VALUES ('He thong dien', 'Kiem tra toan bo mach', 11);
INSERT INTO MaintenancePlanItem (partType, taskName, maintenance_plan_id) VALUES ('Day curoa', 'Thay the moi', 11);
INSERT INTO MaintenancePlanItem (partType, taskName, maintenance_plan_id) VALUES ('Phanh', 'Bao duong toan bo he thong', 11);
