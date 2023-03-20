import Joi from "joi"
import {Request, Response} from "express"
import {Error} from "mongoose";
import {User} from "../user/user.schema";
import {Product} from "../product/product.schema";

const phoneJoi = Joi.extend(require('joi-phone-number'))
const JoiObjectId = require('joi-objectid')(Joi)

const userPostJoiSchema = Joi.object({
    name: Joi.string()
        .min(4)
        .max(30)
        .required(),
    phone: phoneJoi.string()
        .phoneNumber({defaultCountry: 'uk-UA'})
        .required()
        .messages({'phoneNumber.invalid': 'Required format:+38AAABBBCCDD'}),
    email: Joi.string()
        .email({minDomainSegments: 2})
        .required(),
    password: Joi.string()
        .min(6)
        .required()
})

const userPatchJoiSchema = Joi.object({
    name: Joi.string()
        .min(4)
        .max(30)
        .optional(),
    phone: phoneJoi.string()
        .phoneNumber({defaultCountry: 'uk-UA'})
        .optional()
        .messages({'phoneNumber.invalid': 'Required format:+38AAABBBCCDD'}),
    email: Joi.string()
        .email({minDomainSegments: 2})
        .optional(),
    password: Joi.string()
        .min(6)
        .optional()
})

const productPostJoiSchema = Joi.object({
    name: Joi.string()
        .min(4)
        .max(30)
        .required(),
    price: Joi.number()
        .min(0)
        .required(),
    isAvailable: Joi.boolean()
        .required(),
    description: Joi.string()
        .optional(),
    image: Joi.string()
        .optional()
})

const productPatchJoiSchema = Joi.object({
    name: Joi.string()
        .min(4)
        .max(30)
        .optional(),
    price: Joi.number()
        .min(0)
        .optional(),
    isAvailable: Joi.boolean()
        .optional(),
    description: Joi.string()
        .optional(),
    image: Joi.string()
        .optional()
})

const existingUser = async (value: string) => {
    if (value) {
        try {
            const user = await User.findById(value)
            if (!user) {
                throw new Error('Record does not exist')
            }
            return user
        } catch (e: any) {
            throw new Error('Record does not exist')
        }
    }
}

const existingProduct = async (value: string) => {
    if (value) {
        try {
            const user = await Product.findById(value)
            if (!user) {
                throw new Error('Record does not exist')
            }
            return user
        } catch (e: any) {
            throw new Error('Record does not exist')
        }
    }
}


const orderPostJoiSchema = Joi.object({
    user: JoiObjectId()
        .external(existingUser)
        .required(),
    product: JoiObjectId()
        .external(existingProduct)
        .required(),
    qty: Joi.number()
        .integer()
        .min(1)
        .required()
})

const orderPatchJoiSchema = Joi.object({
    user: JoiObjectId()
        .external(existingUser)
        .optional(),
    product: JoiObjectId()
        .external(existingProduct)
        .optional(),
    qty: Joi.number()
        .integer()
        .min(1)
        .optional()
})

const schema: Record<string, any> = {
    user: {
        POST: userPostJoiSchema,
        PATCH: userPatchJoiSchema
    },
    product: {
        POST: productPostJoiSchema,
        PATCH: productPatchJoiSchema
    },
    order: {
        POST: orderPostJoiSchema,
        PATCH: orderPatchJoiSchema
    }
}

export async function dataValidation(req: Request, res: Response, next: any) {
    const targetApi = req.path.split('/')[2]

    if (!schema[targetApi] || !schema[targetApi][req.method]) {
        next()
    } else {
        try {
            await schema[targetApi][req.method].validateAsync(req.body)
            next()
        } catch (e: any) {
            res.status(404).json({message: e.message})
        }
    }
}
