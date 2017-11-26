import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, PrimaryColumn, OneToOne, ManyToOne } from "typeorm";
import { Users } from "./Users";

@Entity()
export class Series extends BaseEntity{

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    title: string;

    @ManyToOne(type => Users, user => user.series)
    //@JoinColumn()
    user: Users;
}