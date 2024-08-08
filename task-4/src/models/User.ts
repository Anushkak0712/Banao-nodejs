import mongoose from 'mongoose';

interface AlertCriteria {
    crypto: string;
    targetPrice: number;
    direction: 'above' | 'below';
}

interface User extends mongoose.Document {
    email: string;
    password: string;
    alerts: AlertCriteria[];
}

const AlertCriteriaSchema = new mongoose.Schema({
    crypto: { type: String, required: true },
    targetPrice: { type: Number, required: true },
    direction: { type: String, enum: ['above', 'below'], required: true },
});

const UserSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        validate: {
            validator: function(value: string) {
                // Regex for basic email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value);
            },
            message:  `Not a valid email address!`
        }
    },
    password: { type: String, required: true },
    alerts: [AlertCriteriaSchema],
});

export default mongoose.model<User>('User', UserSchema);
