import { Table, Column, Model, DataType } from 'sequelize-typescript'


@Table({
    tableName: 'user'
})

/**
 * 定义用户表模型
 */
export default class User extends Model {
    /**
     * id
     */
    @Column({
        primaryKey: true,
        autoIncrement: true,
    })
    id: number

    /**
     * 姓名
     */
    @Column({
        unique: true
    })
    name: string

    /**
     * 生日
     */
    @Column
    dob: string


    /**
     * 地址详细
     */
    @Column
    address: string

    /**
     * 地址经纬度
     */
    @Column(DataType.GEOMETRY)
    gps

    /**
     * 介绍
     */
    @Column
    description: string
}