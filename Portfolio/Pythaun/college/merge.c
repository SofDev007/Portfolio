#include <stdio.h>
#include <stdlib.h>

struct MinHeap {
    int *arr;
    int size;
};

void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

void minHeapify(struct MinHeap *heap, int i) {
    int smallest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;

    if (left < heap->size && heap->arr[left] < heap->arr[smallest])
        smallest = left;

    if (right < heap->size && heap->arr[right] < heap->arr[smallest])
        smallest = right;

    if (smallest != i) {
        swap(&heap->arr[i], &heap->arr[smallest]);
        minHeapify(heap, smallest);
    }
}

int extractMin(struct MinHeap *heap) {
    if (heap->size == 0)
        return 0;

    int root = heap->arr[0];
    heap->arr[0] = heap->arr[heap->size - 1];
    heap->size--;
    minHeapify(heap, 0);

    return root;
}

void insertHeap(struct MinHeap *heap, int val) {
    heap->size++;
    int i = heap->size - 1;
    heap->arr[i] = val;

    while (i != 0 && heap->arr[(i - 1) / 2] > heap->arr[i]) {
        swap(&heap->arr[i], &heap->arr[(i - 1) / 2]);
        i = (i - 1) / 2;
    }
}


int optimalMerge(int files[], int n) {
    struct MinHeap heap;
    heap.arr = (int *)malloc(n * sizeof(int));
    heap.size = 0;

    for (int i = 0; i < n; i++)
        insertHeap(&heap, files[i]);

    int totalCost = 0;

    while (heap.size > 1) {
        int first = extractMin(&heap);
        int second = extractMin(&heap);
        int cost = first + second;
        totalCost += cost;
        insertHeap(&heap, cost);
    }

    free(heap.arr);
    return totalCost;
}

int main() {
    int n;
    printf("Enter the number of files: ");
    scanf("%d", &n);

    int *files = (int *)malloc(n * sizeof(int));

    printf("Enter the sizes of the files: ");
    for (int i = 0; i < n; i++)
        scanf("%d", &files[i]);

    int minCost = optimalMerge(files, n);
    printf("Minimum cost of merging files: %d\n", minCost);

    free(files);
    return 0;
}
