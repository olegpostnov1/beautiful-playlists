const Helper = {
  deepClone: function(items) {
    return items.map(item => Object.assign({}, item));
  }
}

export default Helper