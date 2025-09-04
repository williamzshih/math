#include <math.h>
#include <stdlib.h>

int compare(const void *a, const void *b) {
  double diff = *(double *)a - *(double *)b;
  if (fabs(diff) < 1e-6)
    return 0;
  return diff > 0 ? 1 : -1;
}

double *wasm(double *arr, int len) {
  qsort(arr, len, sizeof(double), compare);
  return arr;
}
