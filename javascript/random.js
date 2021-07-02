function gcd(a, b) {
  if (!b) {
    return a;
  }

  return gcd(b, a % b);
}

function blumBlumShub(bits) {
  var t0 = performance.now();

  if (bits == 0) {
    alert("Entre um tamanho de bits")
    return ;
  }

  let p = 4157;   // p e q -> primos grandes (escolhidos manualmente,
  let q = 4337;   // sem critério, de uma tabela da wikipedia)
  let m = p*q;    // "M = pq is the product of two large primes p and q." - wikipedia

  let seed = Number(new Date());  // Seed: tempo atual em milisegundos desde 01.01.1970
  while (gcd(seed, m) != 1) {     // Se M e o Seed sao co-primos, redesignar seed
    seed = Number(new Date());
  }

  let binaryString = "0b";    // Coloca-se 0b no começo para possibilitar
                              // converter string em número binário, para depois decimal
  let xi = seed;
  for (let i = 0; i < bits; i++) {
    xi = (xi*xi) % m;        // x(n-1) = (x(n))^2 mod M
    binaryString += (xi%2);  // concatena resto da divisão por dois na string
  }

  var tf = performance.now();
  document.getElementById("randResultBits").innerHTML = binaryString.slice(2).length;
  document.getElementById("randResultExec").innerHTML = (tf-t0) + "ms";
  document.getElementById("randResult(decimal)").innerHTML = Number(binaryString);
  document.getElementById("randResult(bin)").innerHTML = binaryString.slice(2);
  //return {binStr:binaryString.slice(2), dec:Number(binaryString), exec:(tf-t0)};
}
