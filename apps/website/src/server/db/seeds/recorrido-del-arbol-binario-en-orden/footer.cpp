
string ltrim(const string &);
string rtrim(const string &);
vector<string> split(const string &);

// Nodo *convertArrayToTree(const vector<long> &array) {
//   if (array.empty()) {
//     return nullptr;
//   }
//   Nodo *root = new Nodo(array[0]);
//   queue<Nodo *> cola;
//   cola.push(root);
//   int i = 1;
//   while (i < array.size()) {
//     Nodo *curr = cola.front();
//     cola.pop();
//     if (i < array.size()) {
//       auto value = array[i++];
//       curr->izquierdo = value == -1 ? nullptr : new Nodo(value);
//       cola.push(curr->izquierdo);
//     }
//     if (i < array.size()) {
//       auto value = array[i++];
//       curr->derecho = value == -1 ? nullptr : new Nodo(value);
//       cola.push(curr->derecho);
//     }
//   }
//   return root;
// }

Nodo *convertArrayToTree(const vector<long> &array) {
  if (array.empty()) {
    return nullptr;
  }

  Nodo *root = new Nodo(array[0]);
  queue<Nodo *> cola;
  cola.push(root);

  int i = 1;
  while (i < array.size()) {
    Nodo *currentNode = cola.front();
    cola.pop();

    auto leftValue = array[i++];
    if (leftValue != -1) {
      currentNode->izquierdo = new Nodo(leftValue);
      cola.push(currentNode->izquierdo);
    }

    if (i < array.size()) {
      auto rightValue = array[i++];
      if (rightValue != -1) {
        currentNode->derecho = new Nodo(rightValue);
        cola.push(currentNode->derecho);
      }
    }
  }
  return root;
}

int main() {
  ofstream fout(getenv("OUTPUT_PATH"));

  string input_count_temp;
  getline(cin, input_count_temp);
  int input_count = stoi(ltrim(rtrim(input_count_temp)));

  vector<vector<long>> arrays(input_count);

  for (auto i = 0; i < input_count; i++) {
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
  }
  for (auto i = 0; i < input_count; i++) {
    vector<long> result =
        recorridoDeArbolBinarioEnOrden(convertArrayToTree(arrays[i]));
    stringstream ss;
    copy(result.begin(), result.end(), ostream_iterator<int>(ss, " "));
    string s = ss.str();
    s = s.substr(0, s.length() - 1);
    if (i != input_count - 1) {
      fout << s << "\n";
    } else {
      fout << s;
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
