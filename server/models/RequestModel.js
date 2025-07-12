const swapRequestSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skillsInvolved: [{ type: String, required: true, trim: true }],
  message: { type: String, required: true, trim: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'cancelled'], default: 'pending' },
}, { timestamps: true });

const SwapRequest = mongoose.model('SwapRequest', swapRequestSchema);

export default SwapRequest;