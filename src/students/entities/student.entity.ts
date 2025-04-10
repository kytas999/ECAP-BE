import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { GenericEntity } from '@/core/generic-entity';
import { AcademyEntity } from '@/school/entities/academy.entity';
import { SchoolEntity } from '@/school/entities/school.entity';
import { UserEntity } from '@/users/entities/user.entity';

import { SampleEntity } from './sample.entity';

@Entity({ name: 'students' })
export class StudentEntity extends GenericEntity {
  @Column()
  school_id: number;

  @Column()
  user_id: number;

  @Column({ nullable: true })
  academy_id: number;

  @Column({ length: 50 })
  grade: string;

  @Index()
  @ManyToOne(() => SchoolEntity, (school) => school.students)
  @JoinColumn({ name: 'school_id' })
  school: SchoolEntity;

  @Index()
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => AcademyEntity)
  @JoinColumn({ name: 'academy_id' })
  academy: AcademyEntity;

  @OneToMany(() => SampleEntity, (sample) => sample.student)
  samples: SampleEntity[];
}
