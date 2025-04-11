const applyUpdateFields = (doc, newData, allowFields) => {
  allowFields.forEach(field => {
		if(newData[field] !== undefined) {
			doc[field] = newData[field];
		}
  })
	return doc;
}

export default applyUpdateFields;