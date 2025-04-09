import mongoose from 'mongoose';
import slugify from 'slugify';

const productSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	slug:{
		type: String,
		unique: true,
	},
	description: {
		type: String,
	},
	detail:{
		type: String,
	},
	defaultPrice: {
		type: Number,
		required: true,
	},
	defaultStock:{
		type: Number,
		required: true,
	},
	category: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Category'
	},
	variants:[
		{
			color: String,
			size: String,
			stock: Number,
			price: Number
		}
	],
	images:{
		type: [String],
		required: true,
	},
	isAvailable: {
		type: Boolean,
		default: true
	}
}, { timestamps: true });

productSchema.pre('save', function (next) {
	if(!this.slug && this.name){
		this.slug = slugify(this.name, {lower: true, strict: true});
	}
	next();
})

productSchema.index({ name: 'text', slug: 1 });


const Product = mongoose.model('Product', productSchema);
export default Product;