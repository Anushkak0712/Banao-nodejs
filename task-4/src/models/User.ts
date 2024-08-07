import mongoose from 'mongoose';

interface AlertCriteria {
    crypto: string;
    targetPrice: number;
    direction: 'above' | 'below';
}

interface User extends mongoose.Document {
    email: string;
    alerts: AlertCriteria[];
}

const AlertCriteriaSchema = new mongoose.Schema({
    crypto: { type: String, required: true },
    targetPrice: { type: Number, required: true },
    direction: { type: String, enum: ['above', 'below'], required: true },
});

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    alerts: [AlertCriteriaSchema],
});

export default mongoose.model<User>('User', UserSchema);
