#include <vector>
#include <algorithm>
#include <numeric>

using namespace std;

long corteMasParejo(vector<long> array) {
  auto length = array.size();
  vector<long> result(length + 1);
  for (auto i = 0; i <= length; i++) {
    long sumaIzq = accumulate(array.begin(), array.begin() + i, 0);
    long sumaDer = accumulate(array.begin() + i, array.end(), 0);
    result[i] = abs(sumaIzq - sumaDer);
  }
  vector<long>::iterator min = min_element(result.begin(), result.end());
  return *min;
}
