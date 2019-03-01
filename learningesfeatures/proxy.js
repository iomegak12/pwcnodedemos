function getData(x, y) {
  console.log("Original Function Logic ... with Arguments .. " + x + ", " + y);

  return x + y;
}

function process(x, y, z) {
  console.log(
    "Process is the function which i would to call getData and see how proxy works for getData()"
  );

  let result = getData(x, y);

  console.log(result + z);
}

getData = new Proxy(getData, {
  apply: (target, current, args) => {
    console.log("Proxying getData() functionality ...");

    let originalResult = target(...args);
    let updatedResult = originalResult + 10;

    console.log("Proxying completed ...");

    return updatedResult;
  }
});

process(10, 20, 30);
