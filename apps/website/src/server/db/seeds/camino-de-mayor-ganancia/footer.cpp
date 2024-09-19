
string ltrim(const string &);
string rtrim(const string &);
vector<string> split(const string &);

int main() {
  ofstream fout(getenv("OUTPUT_PATH"));

  string input_count_temp;
  getline(cin, input_count_temp);
  int input_count = stoi(ltrim(rtrim(input_count_temp)));

  vector<vector<vector<long>>> arrays(input_count);

  for (auto i = 0; i < input_count; i++) {
    string filas_temp;
    getline(cin, filas_temp);
    int filas = stoi(ltrim(rtrim(filas_temp)));

    string columnas_temp;
    getline(cin, columnas_temp);
    int columnas = stoi(ltrim(rtrim(columnas_temp)));

    vector<vector<long>> matrix(filas);

    for (auto j = 0; j < filas; j++) {
      string fila_temp;
      getline(cin, fila_temp);
      vector<string> stringFila = split(rtrim(fila_temp));

      vector<long> longFila(columnas);
      for (auto k = 0; k < columnas; k++) {
        long ar_item = stol(stringFila[k]);

        longFila[k] = ar_item;
      }
      matrix[j] = longFila;
    }
    arrays[i] = matrix;
  }
  for (auto i = 0; i < input_count; i++) {
    long result = caminoDeMayorGanancia(arrays[i]);
    if (i != input_count - 1) {
      fout << result << "\n";
    } else {
      fout << result;
    }
  }
  fout.close();

  return 0;
}

string ltrim(const string &str) {
  string s(str);

  s.erase(s.begin(),
          find_if(s.begin(), s.end(), [](int c) { return !isspace(c); }));

  return s;
}

string rtrim(const string &str) {
  string s(str);

  s.erase(
      find_if(s.rbegin(), s.rend(), [](int c) { return !isspace(c); }).base(),
      s.end());

  return s;
}

vector<string> split(const string &str) {
  vector<string> tokens;

  string::size_type start = 0;
  string::size_type end = 0;

  while ((end = str.find(" ", start)) != string::npos) {
    tokens.push_back(str.substr(start, end - start));

    start = end + 1;
  }

  tokens.push_back(str.substr(start));

  return tokens;
}
