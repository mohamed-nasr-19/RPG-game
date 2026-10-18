def verif(ch):
    i = 0
    while i < len(ch) and "A" <= ch[i] <= "Z":
        i += 1
    return i == len(ch)


def remplir_t1(N):
    T1 = []
    for i in range(N):
        while True:
            ch = input(f"donner T1[{i}] : ")
            if len(ch) >= 5 and verif(ch):
                break
            print("this chain must contain at least 5 letters and must be uppercase")
        T1.append(ch)
    return T1


def remplir_t2(N):
    T2 = []
    for i in range(N):
        while True:
            try:
                x = int(input(f"donner T2[{i}] : "))
                if x > 0 and len(str(x)) == 8:
                    break
                print("this number must be positive and contain exactly 8 digits")
            except ValueError:
                print("Error : give me a damn Number")
        T2.append(x)
    return T2


def code(ch, x):
    s1 = 0
    for i in range(len(ch)):
        if i % 2 == 0:
            s1 += ord(ch[i])

    s2 = 0
    ch1 = str(x)
    for i in range(len(ch1)):
        if int(ch1[i]) % 2 == 0:
            s2 += int(ch1[i])

    return s1 - s2


def forme(T1, T2, N):
    Q = []
    for i in range(N):
        l = len(T1[i])
        q = T1[i][1:l - 1] + str(code(T1[i], T2[i]))
        Q.append(q)
    return Q


while True:
    N = int(input("enter a number: "))
    if 3 <= N <= 8:
        break
    print("N doit etre compris entre 3 et 8")

T1 = remplir_t1(N)
T2 = remplir_t2(N)
Q = forme(T1, T2, N)

print("\ntableau Q :")
for i in range(N):
    print(Q[i])