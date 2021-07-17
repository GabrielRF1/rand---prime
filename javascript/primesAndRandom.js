//--------------*-------------------/
//------------ Aux ----------------/
function gcd(a, b) {
  if (!b) {
    return a;
  }

  return gcd(b, a % b);
}

function generateMask(bits) {
  let mask = "0b1";
  for (var i = 0; i < bits-2; i++) {
    mask += "0";
  }
  mask += "1";
  return mask;
}

//a^d mod p
function powerMod(a, d, p) {
  let result = BigInt(1);
  a = a % p;
  while (d > BigInt(0)) {
    if (d & BigInt(1))
      result = (result*a) % p;
    d = d>>BigInt(1);
    a = (a*a) % p;
  }
  return result;
}
//-----------------------------/

//--------------------*-----------------------------/
//------------ Render Functions -------------------/
function renderRandomResult(binaryString, bits, id) {
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

function renderPrimeResult(binaryString, bits, id, descartados) {
  var decString = (BigInt(binaryString)).toString();
  var binString = binaryString.slice(2);
  document.getElementById("primeResultPrime(decimal)"+id).innerHTML = "";
  document.getElementById("primeResultPrime(bin)"+id).innerHTML = "";

  for (var i = 0; i < decString.length; i++) {
    document.getElementById("primeResultPrime(decimal)"+id).innerHTML += decString[i];
    if ((i+1) % 50 == 0)
      document.getElementById("primeResultPrime(decimal)"+id).innerHTML += "<br>";
  }

  for (var i = 0; i < binString.length; i++) {
    document.getElementById("primeResultPrime(bin)"+id).innerHTML  += binString[i];
    if ((i+1) % 50 == 0)
      document.getElementById("primeResultPrime(bin)"+id).innerHTML  += "<br>";
  }

  document.getElementById("primeResultBits"+id).innerHTML = bits;
  document.getElementById("primeResultDesc"+id).innerHTML = descartados;
  document.getElementById("primeResultExec"+id).innerHTML = "verificar console do navegador";
}
//-------------------------------------------/

//--------------*-------------------/
//----------- Seeds ---------------/
var seedBlum = BigInt(0);
var seedLC = BigInt(0);
//-----------------------------/

//-----------------------*---------------------------------/
//------------ Random Number Functions -------------------/
// Blum Blum Shub
function blumBlumShub(bits, render) {
  console.time('blumBlumShub');

  if (bits <= 0) {
    alert("Entre um tamanho de bits")
    return ;
  }

  let p = 781;   // p e q -> primos grandes congruentes a 3(mod 4)
  let q = 789;   // escolhidos os dois maiores desssa lista https://oeis.org/A016105
  let m = p*q;    // "M = pq is the product of two large primes p and q." - wikipedia

  if (seedBlum == BigInt(0)) {
    seedBlum = Number(new Date());  // Seed: tempo atual em milisegundos desde 01.01.1970

    while (gcd(seedBlum, m) != 1) {     // Se M e o Seed nao sao co-primos, redesignar seed
      seedBlum = Number(new Date());
    }
  }

  let binaryString = "0b";    // Coloca-se 0b no começo para a conversão
                              // da string para o número ser entendida como binário -> decimal
  let xi = seedBlum;
  for (let i = 0; i < bits; i++) {
    xi = xi**2 % m;        // x(n+1) = (x(n))^2 mod M
    binaryString += (xi%2);  // concatena o ultimo bit de Xi
  }

  seedBlum = xi;
  console.timeEnd('blumBlumShub');
  if(render)
    renderRandomResult(binaryString, bits, "1");
  return BigInt(binaryString);
}

// lCG random number generator c = 0, M power of 2
function lCG(bits, render) {
  console.time('lCG');

  if (bits <= 0) {
    alert("Entre um tamanho de bits")
    return ;
  }

  let m = BigInt(2)**BigInt(bits); // M potencia de 2
  let a = BigInt(127);              // congruente a 5(mod 8)
  let c = BigInt(0);                // c = 0

  if (seedLC == BigInt(0)) {
    seedLC = BigInt(new Date()) | BigInt(0b1); // Deve ser impar
  }

  let xi = seedLC;
  let i = 500;
  while (1) {
    xi = (a*xi + c) % m;         // x(n+1) = (a*x(n) + c) mod M
    if (xi.toString(2).length == bits)
      break;
  }

  seedLC = xi | BigInt(0b1);
  console.timeEnd('lCG');
  if(render && xi.toString(2).length == bits)
    renderRandomResult("0b"+xi.toString(2), xi.toString(2).length, "2");
  return BigInt("0b"+xi.toString(2));
}
//---------------------------------------------------/

//-----------------------*---------------------------------/
//------------ Primal test Functions ---------------------/
// Miller Rabin
function millerRabin(randAlg, bits) {
  console.time("rabin");
  let compositeCount = 0;
  tryRandom: do {
    let mask = generateMask(bits); // forçar o numero aleatório a ter 'bits' bits e ser impar

    let toTest;
    if (randAlg == "blum") { // escolhe algoritmo de PRNG
        toTest = blumBlumShub(bits, false);
    } else
      toTest = lCG(bits, false);

    toTest |= BigInt(mask);

    // escrever (n-1) como 2^(s) * d ; n~~>toTest
    var s = BigInt(0), d = BigInt(toTest - BigInt(1));
  	while (d % BigInt(2) == BigInt(0)) {
  		d /= BigInt(2);
  		++s;
  	}

    //testar algumas vezes
    var i = 200;
    var composite = false;
    test: do {
        // a aleatório para base; [2 ; toTest-2]
        let a;
        do {
          a = (randAlg == "blum" ? blumBlumShub(bits, false) : lCG(bits, false));
          a %= (toTest - BigInt(1));
        } while (a < 2);

        let base = powerMod(a,d,toTest);//a**d % toTest;

        if (base == BigInt(1) || base == (toTest - BigInt(1)))
          continue test;

        for (var r = BigInt(1); r < s - BigInt(1); r++) {
          base = base*base % toTest;
          if (base ==  BigInt(1)) // composto
            break;
          if (base == toTest - BigInt(1)) // nao eh composto
            continue test;
        } //terminou o laço for: composto
        composite = true;
        compositeCount++;
        break;
    } while (--i);

    if (!composite) {
        //provavelmente primo
        renderPrimeResult("0b"+toTest.toString(2), bits, "1", compositeCount);
        console.timeEnd("rabin");
        break;
    }
  } while(composite);

}

// Fermat
function fermat(randAlg, bits) {
  console.time("fermat");
  let compositeCount = 0;
  tryRandom: do {
    let mask = generateMask(bits); // forçar o numero aleatório a ter 'bits' bits e ser impar

    let toTest;
    if (randAlg == "blum") {
        toTest = blumBlumShub(bits, false);
    } else
      toTest = lCG(bits, false);

    toTest |= BigInt(mask);

    //testar algumas vezes
    var i = 100;
    var composite = false;
    test: do {
      // gera testemunha a e [2 ; toTest-2]
      let a;
      do {
        a = (randAlg == "blum" ? blumBlumShub(bits, false) : lCG(bits, false));
        a %= (toTest - BigInt(1));
      } while (a < 2);

      // Composto
      if (gcd(toTest, a) != BigInt(1)) {
        composite = true;
        compositeCount++;
        break;
      }

      // Composto
      if (powerMod(a,(toTest-BigInt(1)),toTest) != BigInt(1)) {
        composite = true;
        compositeCount++;
        break;
      }

    } while (--i);
    if(!composite) {
      // provavelmente primo
      renderPrimeResult("0b"+toTest.toString(2), bits, "2", compositeCount);
      console.timeEnd("fermat");
    }
  } while (composite);

}
//------------------------------------------------------/
