function gcd(a, b) {
  if (!b) {
    return a;
  }

  return gcd(b, a % b);
}

function renderResult(binaryString, bits, id) {
  var decString = (BigInt(binaryString)).toString();
  var binString = binaryString.slice(2);
  document.getElementById("randResult(decimal)"+id).innerHTML = "";
  document.getElementById("randResult(bin)"+id).innerHTML = "";

  for (var i = 0; i < decString.length; i++) {
    document.getElementById("randResult(decimal)"+id).innerHTML += decString[i];
    if ((i+1) % 50 == 0)
      document.getElementById("randResult(decimal)"+id).innerHTML += "<br>";
  }

  for (var i = 0; i < binString.length; i++) {
    document.getElementById("randResult(bin)"+id).innerHTML  += binString[i];
    if ((i+1) % 50 == 0)
      document.getElementById("randResult(bin)"+id).innerHTML  += "<br>";
  }

  document.getElementById("randResultBits"+id).innerHTML = bits;
  document.getElementById("randResultExec"+id).innerHTML = "verificar console do navegador";
}

function blumBlumShub(bits) {
  console.time('blumBlumShub');

  if (bits <= 0) {
    alert("Entre um tamanho de bits")
    return ;
  }

  let p = 781;   // p e q -> primos grandes congruentes a 3(mod 4)
  let q = 789;   // escolhidos os dois maiores desssa lista https://oeis.org/A016105
  let m = p*q;    // "M = pq is the product of two large primes p and q." - wikipedia

  let seed = Number(new Date());  // Seed: tempo atual em milisegundos desde 01.01.1970

  while (gcd(seed, m) != 1) {     // Se M e o Seed nao sao co-primos, redesignar seed
    seed = Number(new Date());
  }

  let binaryString = "0b";    // Coloca-se 0b no começo para a conversão
                              // da string para o número ser entendida como binário -> decimal
  let xi = seed;
  for (let i = 0; i < bits; i++) {
    xi = xi**2 % m;        // x(n+1) = (x(n))^2 mod M
    binaryString += (xi%2);  // concatena resto da divisão por dois na string
  }


  console.timeEnd('blumBlumShub');
  renderResult(binaryString, bits, "1");
}

var seed = BigInt(0);

// LCG random number generator c = 0, M power of 2
function LCG(bits) {
  console.time('LCG');

  if (bits <= 0) {
    alert("Entre um tamanho de bits")
    return ;
  }

  let m = BigInt(2)**BigInt(bits); // M potencia de 2
  let a = BigInt(541);              // congruente a 5(mod 8)
  let c = BigInt(0);                // c = 0

  if (seed == BigInt(0)) {
    seed = BigInt(new Date()) | BigInt(0b1); // Deve ser impar

    while (gcd(seed, m) != 1) {     // Se M e o Seed nao sao co-primos, redesignar seed
      seed = BigInt(new Date()) | BigInt(0b1);
    }
  }
  let xi = seed;
  for (var i = 0; i < 500; i++) {
    xi = (a*xi + c) % m;         // x(n+1) = (a*x(n) + c) mod M
    if (xi.toString(2).length == bits)
      break;
  }

  seed = xi;
  console.timeEnd('LCG');
  renderResult("0b"+xi.toString(2), xi.toString(2).length, "2");
}
