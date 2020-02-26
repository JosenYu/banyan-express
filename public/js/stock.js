function main() {
  // 获取mdel_id
  fetch(`/stock/getModel?name=&model=&brand=`)
    .then(response => response.json())
    .then(response => {
      console.log(response);
    });
  // 获取from_id
  fetch("/customer/getFrom?name=")
    .then(res => res.json())
    .then(res => {
      console.log(res);
    });
}
main();
