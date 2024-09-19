
string ltrim(const string &);
string rtrim(const string &);
vector<string> split(const string &);

int main() {
  ofstream fout(getenv("OUTPUT_PATH"));

  string input_count_temp;
  getline(cin, input_count_temp);
  int input_count = stoi(ltrim(rtrim(input_count_temp)));

  vector<vector<long>> arrays(input_count);
  vector<long> capacidades(input_count);

  for (auto i = 0; i < input_count; i++) {
    string capacidad_temp;
    getline(cin, capacidad_temp);

    long capacidad = stol(ltrim(rtrim(capacidad_temp)));

    string ar_count_temp;
    getline(cin, ar_count_temp);

    int ar_count = stoi(ltrim(rtrim(ar_count_temp)));

    string ar_temp_temp;
    getline(cin, ar_temp_temp);
    vector<string> ar_temp = split(rtrim(ar_temp_temp));

    vector<long> ar(ar_count);

    for (int j = 0; j < ar_count; j++) {
      long ar_item = stol(ar_temp[j]);

      ar[j] = ar_item;
    }
    arrays[i] = ar;
    capacidades[i] = capacidad;
  }
  for (auto i = 0; i < input_count; i++) {
    long result = maximaDuracionDeCancionesEnCd(arrays[i], capacidades[i]);
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
