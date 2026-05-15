import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { DepartmentModule } from './modules/department/department.module';
import { DivisionModule } from './modules/division/division.module';
import { OfficeModule } from './modules/office/office.module';
import { UnitModule } from './modules/unit/unit.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { PositiongroupModule } from './modules/positiongroup/positiongroup.module';
import { PositioncodeModule } from './modules/positioncode/positioncode.module';
import { PositionModule } from './modules/position/position.module';
import { RoleModule } from './modules/role/role.module';
import { MeetingdocModule } from './modules/meetingdoc/meetingdoc.module';
import { AssignModule } from './modules/assign/assign.module';
import { ResponsibleModule } from './modules/responsible/responsible.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UserModule,
    AuthModule,
    DepartmentModule,
    DivisionModule,
    OfficeModule,
    UnitModule,
    EmployeeModule,
    PositiongroupModule,
    PositioncodeModule,
    PositionModule,
    RoleModule,
    MeetingdocModule,
    AssignModule,
    ResponsibleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
