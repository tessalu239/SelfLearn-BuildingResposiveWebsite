module.exports = function Cart(oldCart) {
  this.items = oldCart.items || {};
  this.total = oldCart.total || 0;
  this.totalQty = oldCart.totalQty || 0;
  tax = 0.1;
  this.totalTax = oldCart.totalTax || 0;
  this.finalPrice = oldCart.finalPrice || 0;

  this.add = function (item, id) {
    let storedItem = this.items[id]; // Change const to let
    if (!storedItem) {
      storedItem = this.items[id] = { item: item, qty: 0, price: 0 };
    }
    storedItem.qty++;
    storedItem.price = storedItem.item.price * storedItem.qty;
    this.totalQty++;
    this.total += parseFloat(storedItem.item.price);
    this.total = parseFloat(this.total.toFixed(2));
    this.totalTax = parseFloat((this.total * tax).toFixed(2)); // Round to 2 decimal places
    this.finalPrice = parseFloat((this.total + this.totalTax).toFixed(2));
  };
  this.generateArray = function () {
    const arr = [];
    for (const id in this.items) {
      arr.push(this.items[id]);
    }
    return arr;
  };

  this.remove = function (item, id) {
    let storedItem = this.items[id];
    if (storedItem) {
      storedItem.qty--;
      storedItem.price = storedItem.item.price * storedItem.qty;
      this.totalQty--;
      this.total -= parseFloat(storedItem.item.price);
      this.total = parseFloat(this.total.toFixed(2));
      this.totalTax = parseFloat((this.total * tax).toFixed(2));
      this.finalPrice = parseFloat((this.total + this.totalTax).toFixed(2));
      if (storedItem.qty <= 0) {
        delete this.items[id];
      }
    }
  };
};
