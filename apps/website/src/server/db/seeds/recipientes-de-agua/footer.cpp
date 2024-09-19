
string ltrim(const string &);
string rtrim(const string &);
vector<string> split(const string &);

int main() {
  ofstream fout(getenv("OUTPUT_PATH"));

  string input_count_temp;
  getline(cin, input_count_temp);
  int input_count = stoi(ltrim(rtrim(input_count_temp)));

  vector<vector<long>> arrays(input_count);
  vector<vector<long>> capacidades(input_count);

  for (auto i = 0; i < input_count; i++) {
    string ar_temp_temp;
    getline(cin, ar_temp_temp);
    vector<string> ar_temp = split(rtrim(ar_temp_temp));

    vector<long> ar(ar_temp.size());

    for (int j = 0; j < ar_temp.size(); j++) {
      long ar_item = stol(ar_temp[j]);

      ar[j] = ar_item;
    }
    arrays[i] = ar;

    string capacidades_temp_temp;
    getline(cin, capacidades_temp_temp);
    vector<string> capacidades_temp = split(rtrim(capacidades_temp_temp));

    vector<long> capacidadBaldes(capacidades_temp.size());

    for (int j = 0; j < capacidades_temp.size(); j++) {
      long ar_item = stol(capacidades_temp[j]);

      capacidadBaldes[j] = ar_item;
    }

    capacidades[i] = capacidadBaldes;
  }
  for (auto i = 0; i < input_count; i++) {
    long result =
        recipienteDeAgua(arrays[i], capacidades[i][0], capacidades[i][1]);
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
