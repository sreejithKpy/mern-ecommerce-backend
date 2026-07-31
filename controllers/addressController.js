const { default: mongoose } = require("mongoose");
const Address = require("../models/Address");

const addAddress = async (req, res)=>{
    const userId = req.user.id;
    
    const {
        fullName,
        phone,
        addressLine,
        city,
        state,
        postalCode,
        country,
        isDefault,
    } = req.body;

    try{
        if(!fullName || !phone || !addressLine || !city || !state || !postalCode || !country){
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            })
        }

        if(isDefault){
            await Address.updateMany(
                {user: userId},
                {isDefault: false}
            )
        }

        const addressCount = await Address.countDocuments({
            user: userId
        })

        let defaultValue = isDefault

        if(addressCount === 0){
            defaultValue = true;
        }

        const address = await Address.create({
            user: userId,
            fullName,
            phone,
            addressLine,
            city,
            state,
            postalCode,
            country,
            isDefault: defaultValue
        })

        res.status(201).json({
            success: true,
            message: "Address added successfully.",
            address
        })

    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }

}

const getAddress = async (req, res)=>{
    const userId = req.user.id;

    try{
        const address = await Address.find({
            user: userId
        }).sort({ isDefault: -1, createdAt: -1})

        res.status(200).json({
            success: true,
            address
        })

    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const updateAddress = async (req, res)=>{
    const {id} = req.params;
    const userId = req.user.id;

    const {
        fullName,
        phone,
        addressLine,
        city,
        state,
        postalCode,
        country
    } = req.body;

    try{
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success: false,
                message: "Invalid address ID."
            })
        }

        const address = await Address.findOne({
            _id: id,
            user: userId
        })

        if(!address){
            return res.status(404).json({
                success: false,
                message: "Address not found"
            })
        }

        if(fullName){
            address.fullName = fullName
        }
        if(phone){
            address.phone = phone
        }
        if(addressLine){
            address.addressLine = addressLine
        }
        if(city){
            address.city = city
        }
        if(state){
            address.state = state
        }
        if(postalCode){
            address.postalCode = postalCode
        }
        if(country){
            address.country = country
        }

        await address.save()

        res.status(200).json({
            success: true,
            message: "Address updated successfully.",
            address
        })

    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const deleteAddress = async (req, res)=>{
    const {id} = req.params;
    const userId = req.user.id;

    try{
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success: false,
                message: "Invalid address ID."
            })
        }

        const address = await Address.findOne({
            _id: id,
            user: userId
        })

        if(!address){
            return res.status(404).json({
                success: false,
                message: "Address not found."
            })
        }

        const wasDefault = address.isDefault;

         await address.deleteOne();


        if(wasDefault){
            const anotherAddress = await Address.findOne({
                user: userId
            }).sort({createdAt: 1})

            if(anotherAddress){
                anotherAddress.isDefault = true

                await anotherAddress.save()
            }
        }

       
        res.status(200).json({
            success: true,
            message: "Address deleted successfully."
        })

    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const setDefaultAddress = async (req, res)=>{
    const {id} = req.params;
    const userId = req.user.id;

    try{
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success: false,
                message: "Invalid address ID."
            })
        }

        const address = await Address.findOne({
            _id: id,
            user: userId
        })

        if(!address){
            return res.status(404).json({
                success: false,
                message: "Address not found."
            })
        }

        await Address.updateMany(
            {user: userId},
            {isDefault: false}
        )

        address.isDefault = true;

        await address.save();

        res.status(200).json({
            success: true,
            message: "Default address updated successfully.",
            address
        })

    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    addAddress,
    getAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
}

