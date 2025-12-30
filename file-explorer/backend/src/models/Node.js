import mongoose from 'mongoose';

const nodeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [1, 'Name cannot be empty'],
    maxlength: [255, 'Name too long']
  },
  type: {
    type: String,
    required: true,
    enum: ['file', 'folder']
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    ref: 'Node'
  }
}, {
  timestamps: true
});

// Index for faster queries
nodeSchema.index({ parentId: 1 });

const Node = mongoose.model('Node', nodeSchema);

export default Node;
