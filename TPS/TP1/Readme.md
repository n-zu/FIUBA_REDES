## Public-Key Cryptography Standards (PKCS) #1: RSA Cryptography

[RFC](https://www.rfc-editor.org/rfc/rfc3447.html)

### 1. Introducción

This document provides recommendations for the implementation of public-key cryptography based on the RSA algorithm

covering the following aspects:

- Cryptographic primitives
- Encryption schemes
- Signature schemes with appendix
- ASN.1 syntax for representing keys and for identifying the schemes

### 2. Notation

- GCD : greatest common divisor of two nonnegative integers
- LCM : least common multiple of a list of nonnegative integers
- CRT : Chinese Remainder Theorem
  > if one knows the remainders of the division of an integer n by several integers, one can determine the remainder of the division of n by the product of these integers ( if no two divisors share a common factor other than 1)
- === : congruence symbol
  > a === b (mod n) means that the integer n divides the integer a - b
  > => a % n = b
- an octet string is an ordered sequence of octets (eight-bit bytes) - big endian

### 3. Key Types

Together, an RSA public key and an RSA private key form an RSA key pair

#### 3.1 RSA Public Key

RSA public key consists of two components:

- n : the RSA modulus, a positive integer
  > a product of u distinct odd primes r_i, i = 1, 2, ..., u, where u >= 2
- e : the RSA public exponent, a positive integer
  > an integer between 3 and n - 1
  > satisfying: $GCD(e,\lambda(n)) = 1$, (coprime)
  > where: $\lambda(n) = LCM(r_1 - 1, ..., r_u - 1)$
  >
  > > for u = 2: $(p - 1) (q - 1)$
  > >
  > > - r_1 = p , r2 = q
  > > - $\lambda(n) = (p-1) (q-1)$

#### 3.2 RSA Private Key

RSA private key may have either of two representations

##### Pair

The first representation consists of the pair (n, d)

- n : the RSA modulus, a positive integer
  > the same as in the corresponding RSA public key
- d : the RSA private exponent, a positive integer
  > a positive integer less than n
  > satisfying: (e · d) % $\lambda(n)$ = 1

##### Quintuple (CRT)

The second representation consists of a quintuple (p, q, dP, dQ, qInv)
and a (possibly empty) sequence of triplets (r_i, d_i, t_i) i = 3, ..., u, one for each prime not in the quintuple

> More complex, but faster

- p : the first factor (r_1) , a positive integer
- q : the second factor (r_2), a positive integer
- dP : the first factor's CRT exponent, a positive integer
- dQ : the second factor's CRT exponent, a positive integer

> the two factors p and q are the first two prime factors of the RSA modulus n (i.e., r_1 and r_2),
> the CRT exponents dP and dQ are positive integers less than p and q respectively satisfying:
>
> - (e · dP) % (p-1) = 1
> - (e · dQ) % (q-1) = 1

- qInv : the (first) CRT coefficient, a positive integer

> the CRT coefficient qInv is a positive integer less than p
>
> - satisfying: (q · qInv) % p = 1

If u > 2, the representation will include one or more triplets (r_i, d_i, t_i), i = 3, ..., u

- r_i : the i-th factor, a positive integer
  > the additional prime factors of the RSA modulus n
- d_i : the i-th factor's CRT exponent, a positive integer
  > - satisfying: (e · d_i) % (r_i - 1) = 1
- t_i : the i-th factor's CRT coefficient, a positive integer
  > Each CRT coefficient t_i (i = 3, ..., u) is a positive integer less than r_i
  >
  > - satisfying: (R_i · t_i) % r_i = 1
  > - where: $R_i = r_1 · r_2 · ... · r_{(i-1)}$

> NOTE:
> We can see a difference between qInv and t_i, this is so to keep compatibility with previous representations of RSA private keys
>
> > The definition of the CRT coefficients here and the formulas that use them in the primitives in Section 5 generally follow Garner's algorithm [22] (see also Algorithm 14.71 in [37]). However, for compatibility with the representations of RSA private keys in PKCS #1 v2.0 and previous versions, the roles of p and q are reversed compared to the rest of the primes. Thus, the first CRT than as the inverse of R_1 mod r_2, i.e., of p mod q. coefficient, qInv, is defined as the inverse of q mod p, rather

### 4. Data conversion primitives

#### 4.1. I2OSP ( Integer-to-Octet-String primitive )

I2OSP converts a nonnegative integer to an octet string of a specified length.

```
I2OSP (x, xLen)
```

##### Input:

- x : nonnegative integer to be converted
- xLen : intended length of the resulting octet string

##### Output:

- X : corresponding octet string of length xLen

- Error : "integer too large"

##### Steps:

1. If x >= $256^{xLen}$, output "integer too large" and stop.

2. Write the integer x in its unique xLen-digit representation in base 256:
   $x = x_{xLen-1} · 256^{xLen-1} + x_{xLen-2} 256^{xLen-2} +...+ x_1 256 + x_0$,
   where 0 <= x_i < 256

3. Let the octet $X_i$ have the integer value $x_{xLen-i}$ for 1 <= i <= xLen. Output the octet string
   $X = X_1 X_2 ... X_{xLen}$

#### 4.2. OS2IP ( Octet-String-to-Integer primitive )

OS2IP converts an octet string to a nonnegative integer.

```
OS2IP (X)
```

##### Input:

- X : octet string to be converted

##### Output:

- x : corresponding nonnegative integer

##### Steps:

1.  Let $X_1$ $X_2$ ... $X_{xLen}$ be the octets of X from first to last,
    and let $x_{xLen-i}$ be the integer value of the octet X_i for 1 <= i <= xLen.

2.  Let `x = x_(xLen-1) 256^(xLen-1) + x_(xLen-2) 256^(xLen-2) + ... + x_1 256 + x_0 `

### 5. Cryptographic primitives

Cryptographic primitives are basic mathematical operations on which cryptographic schemes can be built

#### 5.1 Encryption and decryption primitives

An encryption primitive produces a ciphertext representative from a message representative under the control of a public key, and a decryption primitive recovers the message representative from the ciphertext representative under the control of the corresponding private key

RSA encryption and decryption primitives :

- RSAEP ( RSA Encryption Primitive ) : Encrypts a message using a public key
- RSADP ( RSA Decryption Primitive ) : Decrypts ciphertext using a private key

##### 5.1.1 RSAEP

```
RSAEP ((n, e), m)
```

###### Input:

- (n, e) : RSA public key
- m : message representative, an integer between 0 and n - 1

###### Output:

- c : ciphertext representative, an integer between 0 and n - 1

- Error : "message representative out of range"

> Assumption: RSA public key (n, e) is valid

###### Steps:

1.  If the message representative m is not between 0 and n - 1, output "message representative out of range" and stop.

2.  Let c = m^e % n.

3.  Output c.

##### 5.1.2 RSADP

```
RSADP (K, c)
```

###### Input:

- K : RSA private key, where K has one of the following forms:
  1. a pair (n, d)
  2. a quintuple (p, q, dP, dQ, qInv) and a possibly empty sequence of triplets (r_i, d_i, t_i), i = 3, ..., u
- c : ciphertext representative, an integer between 0 and n - 1

###### Output:

- m : message representative, an integer between 0 and n - 1

- Error : "ciphertext representative out of range"

> Assumption: RSA private key K is valid

###### Steps:

1. If the ciphertext representative c is not between 0 and n - 1, output "ciphertext representative out of range" and stop.

2. The message representative m is computed as follows.

   1. If the first form (n, d) of K is used, let m = c^d % n.
   2. If the second form (p, q, dP, dQ, qInv) and (r_i, d_i, t_i)
      of K is used, proceed as follows:

   ```
   i.    Let m_1 = c^dP mod p and m_2 = c^dQ mod q.

   ii.   If u > 2, let m_i = c^(d_i) mod r_i, i = 3, ..., u.

   iii.  Let h = (m_1 - m_2) * qInv mod p.

   iv.   Let m = m_2 + q * h.

   v.    If u > 2, let R = r_1 and for i = 3 to u do

     1. Let R = R * r_(i-1).

     2. Let h = (m_i - m) * t_i mod r_i.

     3. Let m = m + R * h.
   ```

3. Output m.

> Note. Step 2.b can be rewritten as a single loop, provided that one reverses the order of p and q. For consistency with PKCS #1 v2.0, however, the first two primes p and q are treated separately from the additional primes.

#### 5.2 Signature and verification primitives

A signature primitive produces a signature representative from a message representative under the control of a private key, and a verification primitive recovers the message representative from the signature representative under the control of the corresponding public key.

RSA signature and verification primitives :

- RSASP1 ( RSA Signature Primitive 1 ) : Creates a signature over a message using a private key
- RSAVP1 ( RSA Verification Primitive 1 ) : Verifies a signature is for a message using a public key

##### 5.2.1 RSASP1

```
RSASP1 (K, m)
```

###### Input:

- K : RSA private key, where K has one of the following forms:
  1. a pair (n, d)
  2. a quintuple (p, q, dP, dQ, qInv) and a possibly empty sequence of triplets (r_i, d_i, t_i), i = 3, ..., u
- m : message representative, an integer between 0 and n - 1

###### Output:

- s : signature representative, an integer between 0 and n - 1

- Error : "ciphertext representative out of range"

> Assumption: RSA private key K is valid

###### Steps:

1. If the message representative c is not between 0 and n - 1, output "message representative out of range" and stop.

2. The signature representative s is computed as follows.

   1. If the first form (n, d) of K is used, let s = m^d mod n.
   2. If the second form (p, q, dP, dQ, qInv) and (r_i, d_i, t_i)
      of K is used, proceed as follows:

   ```
    i.    Let s_1 = m^dP mod p and s_2 = m^dQ mod q.

    ii.   If u > 2, let s_i = m^(d_i) mod r_i, i = 3, ..., u.

    iii.  Let h = (s_1 - s_2) * qInv mod p.

    iv.   Let s = s_2 + q * h.

    v.    If u > 2, let R = r_1 and for i = 3 to u do

      1. Let R = R * r_(i-1).

      2. Let h = (s_i - s) * t_i mod r_i.

      3. Let s = s + R * h.
   ```

3. Output s.

> Note. Step 2.b can be rewritten as a single loop, provided that one reverses the order of p and q. For consistency with PKCS #1 v2.0, however, the first two primes p and q are treated separately from the additional primes

##### 5.2.2 RSAVP1

```
RSAVP1 ((n, e), s)
```

###### Input:

- (n, e) : RSA public key
- s : signature representative, an integer between 0 and n - 1

###### Output:

- m : message representative, an integer between 0 and n - 1

- Error : "signature representative out of range"

> Assumption: RSA public key (n, e) is valid

###### Steps:

1. If the signature representative s is not between 0 and n - 1, output "signature representative out of range" and stop.

2. Let m = s^e mod n.

3. Output m.

---

1. Introduction (.5 min)
2. Notation (.5 min)
3. Key Types (3 min)
4. Data conversion primitives (2 min)
5. Cryptographic primitives (3 min)
