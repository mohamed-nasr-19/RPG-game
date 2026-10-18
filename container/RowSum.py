def saisir():
    x = int(input("x= "))
    while not 2 <= x <= 9:
        x = int(input("x= "))
    return x

def remplir(N, M):
    T = []
    for i in range(N):
        ligne = []
        for j in range(M):
            ligne.append(int(input(f"donner T[{i},{j}] : ")))
        T.append(ligne)
    return T

def RowSum(T, N, M):
    S = []
    for i in range(N):
        somme = 0
        for j in range(M):
            somme += T[i][j]
        S.append(somme)
    return S

# algorithme Row-Sum
N = saisir()
M = saisir()
T = remplir(N, M)
S = RowSum(T, N, M)
print("\ntableau:")
for i in range(N):
    print("Row", T[i], ":", S[i])