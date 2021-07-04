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

  let p = 4157;   // p e q -> primos grandes (escolhidos manualmente,
  let q = 4337;   // sem critério, de uma tabela da wikipedia)
  let m = p*q;    // "M = pq is the product of two large primes p and q." - wikipedia

  let seed = Number(new Date());  // Seed: tempo atual em milisegundos desde 01.01.1970
  while (gcd(seed, m) != 1) {     // Se M e o Seed nao sao co-primos, redesignar seed
    seed = Number(new Date());
  }

  let binaryString = "0b";    // Coloca-se 0b no começo para a conversão
                              // da string para o número ser entendida como binário -> decimal
  let xi = seed;
  for (let i = 0; i < bits; i++) {
    xi = (xi*xi) % m;        // x(n+1) = (x(n))^2 mod M
    binaryString += (xi%2);  // concatena resto da divisão por dois na string
  }

  console.timeEnd('blumBlumShub');
  renderResult(binaryString, bits, "1");
}

// Park–Miller random number generator
function parkMiller(bits) {
  console.time('parkMiller');
  if (bits <= 0) {
    alert("Entre um tamanho de bits")
    return ;
  }

  let m = Math.pow(2, 31) - 1; // Valore propostos por Park e Miller
  let a = Math.pow(7, 5)       // M -> Primo Mersenne; a -> raiz primitiva módulo M

  let seed = Number(new Date());  // Seed: tempo atual em milisegundos desde 01.01.1970
  while (gcd(seed, m) != 1) {     // Se M e o Seed nao sao co-primos, redesignar seed
    seed = Number(new Date());
  }

  let binaryString = "0b";    // Coloca-se 0b no começo para a conversão
                              // da string para o número ser entendida como binário -> decimal
  let xi = seed;
  for (let i = 0; i < bits; i++) {
    xi = (a*xi) % m;         // x(n+1) = (a*x(n)) mod M
    binaryString += (xi%2);  // concatena resto da divisão por dois na string
  }

  console.timeEnd('parkMiller');
  renderResult(binaryString, bits, "2");
}
