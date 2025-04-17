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
		required: true
	},
	detail:{
		type: String,
		required: true
	},
	category: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Category',
		required: true
	},
	variants:[
		{
			color: {
				type: String,
				required: true
			},
			sizes:[
				{
					size: {
						type: String,
						required: true
					},
					stock: {
						type: Number,
						required: true
					},
					price: {
						type: Number,
						required: true
					}
				}
			]
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

productSchema.pre('validate', function(next){
	if(!this.variants || this.variants.length === 0){
		this.invalidate('variants', 'At least one variant is required');
	}
	next();
});

productSchema.pre('save', function (next) {
	if(!this.slug && this.name){
		this.slug = slugify(this.name, {lower: true, strict: true});
	}
	next();
})

productSchema.index({ name: 'text', slug: 1 });


const Product = mongoose.model('Product', productSchema);
export default Product;