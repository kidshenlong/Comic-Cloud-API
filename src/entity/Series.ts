import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm";

@Entity()
export class Series extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;
}