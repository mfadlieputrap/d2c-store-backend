import mongoose from 'mongoose';
import slugify from 'slugify';

const categorySchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	slug:{
		type: String,
		unique: true
	},
	parent:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Category',
		default: null
	}
}, { timestamps: true });

categorySchema.pre('save', function (next) {
	if(!this.slug && this.name){
		this.slug = slugify(this.name, { lower: true, strict: true });
	}
	next();
})

const Category = mongoose.model('Category', categorySchema);
export default Category;