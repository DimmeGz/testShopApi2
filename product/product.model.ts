import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize'
import {sequelize} from '../utils/postgresqlConnect'
import {User} from '../user/user.model';
import {Order} from '../order/order.models';

interface ProductModel extends Model<InferAttributes<ProductModel>, InferCreationAttributes<ProductModel>> {
    id: CreationOptional<number>
    name: string;
    description: string
    image: string
    price: number
    isAvailable: boolean
    CategoryId: number

}

export const Product = sequelize.define<ProductModel>('Product', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.STRING,
    },
    image: {
        type: DataTypes.STRING
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    isAvailable: {
        type:DataTypes.BOOLEAN,
        defaultValue: true,
    },
    CategoryId: {
        type: DataTypes.SMALLINT
    }
})


interface CategoryModel extends Model<InferAttributes<CategoryModel>, InferCreationAttributes<CategoryModel>> {
    id: CreationOptional<number>
    name: string;
    description: string

}

export const Category = sequelize.define<CategoryModel>('Category', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.STRING,
    }
})

Category.hasMany(Product)
Product.belongsTo(Category)