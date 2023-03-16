import {body, check} from "express-validator"
import {Product} from "../models/Product.js"
import {User} from "../models/User.js"

export const userValidators = [
    body('name').isLength({min: 4}),
    body('phone').isMobilePhone("uk-UA", undefined),
    body('email').isEmail(),
    body('password').isLength({min: 6})
]

export const productValidators = [
    body('name').isLength({min: 4}),
    body('price').isFloat({min: 0}),
    body('availability').isBoolean()
]

export const orderValidators = [
    body('user')
        .custom(async value => {
            const user = await User.findById(value)
            if (!user) {
                throw new Error('User does not exist')
            }
            return true
        }),
    body('product')
        .custom(async value => {
            const product = await Product.findById(value)
            if (!product) {
                throw new Error('Product does not exist')
            }
            return true
        }),
    body('qty').isInt({min: 1, max: 999}),
]