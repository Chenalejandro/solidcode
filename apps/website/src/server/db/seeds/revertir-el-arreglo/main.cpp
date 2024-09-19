#include <string>
#include <vector>
#include <fstream>
#include <iostream>
#include <iterator>
#include <sstream>
#include <algorithm>

using namespace std;

vector<long> revertir(vector<long> ar) {
    auto length = ar.size();
    vector<long> result(length);
    for (auto i = 0; i < length; i++) {
        result[i] = ar[length - 1 - i];
    }
    return result;
}
