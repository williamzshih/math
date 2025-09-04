double wasm(double *arr, int len) {
  double sum = 0;
  for (int i = 0; i < len; i++)
    sum += arr[i];
  return sum / len;
}
