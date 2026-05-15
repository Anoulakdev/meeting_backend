import { Injectable } from '@nestjs/common';
// import { CreateDepartmentDto } from './dto/create-department.dto';
// import { UpdateDepartmentDto } from './dto/update-department.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { createDepartment } from './services/create';
import { findAllDepartment } from './services/findall';
import { findOneDepartment } from './services/findone';

@Injectable()
export class DepartmentService {
  constructor(private prisma: PrismaService) {}

  create() {
    return createDepartment(this.prisma);
  }

  findAll() {
    return findAllDepartment(this.prisma);
  }

  findOne(id: number) {
    return findOneDepartment(this.prisma, id);
  }
}
