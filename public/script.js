const spec = angular.module('spec', []);
spec.controller('specCtrl', function($scope, $http, $interval) {

    //get data from server
    $scope.getData = function(dataSize) {
        $http({
            method: "get",
            params: {
                "dataSize": dataSize
            },
            url: "http://120.24.88.103:3000/api"
        }).success(function(res) {
            $scope.dataSet = res.data;
            // console.log(res.data);
            // console.log(res);
            // console.log('dataSet', $scope.dataSet);
            $scope.resDataSize = $scope.dataSize;
        });
    }



    $scope.sort = function(sortMethod) {

    }

    $scope.testsort = function(sortMethod) {

        if (!sortMethod) {
            console.error('a sort method is required');
            return;
        }
        if (!$scope.dataSet) {
            console.error('data set required');
            return;
        }

        //make a copy of $scope.dataSet to a local list
        var list = [];

        $scope.dataSet.forEach(function(e) {
            list.push(e)
        });

        console.log(sortMethod);

        const steps = [];

        switch (sortMethod) {
            case 'selection sort':
                selectionsort(list, steps);
                break;
            case 'insertion sort':
                insertionsort(list, steps);
                break;
            case 'shell sort':
                shellsort(list, steps);
                break;
            case 'merge sort':
                mergesort(list, steps);
                break;
            case 'quick sort':
                quicksort(list, steps);
                break;
            case 'heap sort':
                heapsort_alt(list, steps);
                break;
            default:
                console.error('sort method error');
        }

        $scope.dataAccess = 0;
        $scope.comparation = 0;

        console.log(list);
        console.log(steps);
        var timer = $interval(function() {
            readStep(steps);
            if (steps.length === 0) {
                $scope.min = 'null';
                $scope.pointer = 'null';
                $scope.sorted = 'null';
                $interval.cancel(timer)
            }
        }, 20);

        timer.then(success);

        function success() {
            console.log('sorting terminated');
        }
    }

    //sort methods
    const selectionsort = function(list, steps) {


        // console.log($scope.dataSet, list);
        const len = list.length;



        for (var i = 0; i < len; i++) {
            var min = i;
            steps.push({
                'sorted': i
            })
            steps.push({
                'min': i
            });

            for (var j = i + 1; j < len; j++) {
                steps.push({
                    'pointer': j
                })
                if (list[j] < list[min]) {
                    min = j;
                    steps.push({
                        'min': j
                    });
                }
            }
            if (i === min) {
                //不用交换
                continue;
            }
            var temp = list[i];
            list[i] = list[min];
            list[min] = temp;
            steps.push({
                'swap': [i, min]
            });
        }
        // console.log($scope.dataSet, list);
        // console.log(steps.length);
    }

    const insertionsort = function(list, steps) {
        const len = list.length;
        for (var i = 0; i < len; i++) {

            for (var j = i; j >= 0; j--) {
                steps.push({
                    pointer: j
                });
                if (list[j] > list[j + 1]) {
                    var temp = list[j];
                    list[j] = list[j + 1];
                    list[j + 1] = temp;
                    steps.push({
                        'swap': [j, j + 1]
                    });
                } else {
                    break;
                }

            }
            steps.push({
                sorted: i
            });

        }

    }

    const shellsort = function(list, steps) {
        const len = list.length;

        var h = 1;
        while (h < len / 3) {
            h = 3 * h + 1; // 1, 4, 13, 40, 121...
        }
        while (h >= 1) {
            //使数组h有序
            for (var i = h; i < len; i++) {
                for (var j = i;
                    (j >= h) && (list[j] < list[j - h]); j -= h) {
                    var temp = list[j];
                    list[j] = list[j - h];
                    list[j - h] = temp;
                    steps.push({
                        'swap': [j, j - h]
                    });
                }

            }
            h = Math.floor(h / 3);
        }



    }

    const mergesort = function(list, steps) {

        const len = list.length;


        const sort = function(list, lo, hi) {
            if (hi <= lo) return;
            var mid = lo + Math.floor((hi - lo) / 2);
            sort(list, lo, mid);
            sort(list, mid + 1, hi);
            merge(list, lo, mid, hi);

        }

        const merge = function(list, lo, mid, hi) {
            var aux = [];
            var i = lo;
            var j = mid + 1;
            for (var k = lo; k <= hi; k++) {
                aux[k] = list[k];
            }
            for (var k = lo; k <= hi; k++) {
                if (i > mid) {
                    steps.push({
                        'is': [k, aux[j]]
                    });
                    list[k] = aux[j++];
                } else if (j > hi) {
                    steps.push({
                        'is': [k, aux[i]]
                    });
                    list[k] = aux[i++];
                } else if (aux[j] < aux[i]) {
                    steps.push({
                        'is': [k, aux[j]]
                    });
                    list[k] = aux[j++];
                } else {
                    steps.push({
                        'is': [k, aux[i]]
                    });
                    list[k] = aux[i++];
                }
            }

        }

        sort(list, 0, len - 1);
    }

    const quicksort = function(list, steps) {

        const len = list.length;

        const sort = function(list, lo, hi) {
            if (hi <= lo) return;
            const j = partition(list, lo, hi);
            sort(list, lo, j - 1);
            sort(list, j + 1, hi);

        }

        const partition = function(list, lo, hi) {
            var i = lo,
                j = hi + 1;
            const v = list[lo];
            while (true) {
                while (list[++i] < v) {
                    steps.push({
                        'sorted': i
                    });
                    if (i === hi) break;
                }

                while (v < list[--j]) {
                    steps.push({
                        'sorted': j
                    });
                    if (j === lo) break;
                }

                if (i >= j) break;
                var temp = list[i];
                list[i] = list[j];
                list[j] = temp;

                steps.push({
                    'swap': [i, j]
                });
            }
            var temp = list[lo];
            list[lo] = list[j];
            list[j] = temp;

            steps.push({
                'swap': [lo, j]
            });
            return j;
        }

        sort(list, 0, len - 1);
    }

    const heapsort = function(list, steps) {



        const swim = function(list, k) {
            while (k > 1 && list[Math.floor(k / 2)] < list[k]) {
                var temp = list[Math.floor(k / 2)];
                list[Math.floor(k / 2)] = list[k];
                list[k] = temp;
                k = Math.floor(k / 2);
            }
        }

        const sink = function(list, k, len) {
            list[0] = list[k];
            for (var i = 2 * k; i <= len; i *= 2) {
                if (i < len && list[i] < list[i + 1]) {
                    i++;
                }
                if (list[0] >= list[i]) {
                    break;
                } else {
                    list[k] = list[i];
                    k = i;
                }
            }
            list[k] = list[0];
        }

        const BuildMaxHeap = function(list, len) {
            for (var i = Math.floor(len / 2); i > 0; i--) {
                sink(list, i, len);
            }
        }

        const sort = function(list, len) {
            BuildMaxHeap(list, len);
            for (var i = len; i > 1; i--) {
                var temp = list[i];
                list[i] = list[1];
                list[1] = temp;
                sink(list, 1, i - 1);
            }
        }
        sort(list, list.length);

    }
    const heapsort_alt = function(list, steps) {
        function headAdjust(elements, pos, len) {
            //将当前节点值进行保存
            var swap = elements[pos];

            //定位到当前节点的左边的子节点
            var child = pos * 2 + 1;

            //递归，直至没有子节点为止
            while (child < len) {
                //如果当前节点有右边的子节点，并且右子节点较大的场合，采用右子节点
                //和当前节点进行比较
                if (child + 1 < len && elements[child] < elements[child + 1]) {
                    child += 1;
                }

                //比较当前节点和最大的子节点，小于则进行值交换，交换后将当前节点定位
                //于子节点上
                if (elements[pos] < elements[child]) {
                    elements[pos] = elements[child];
                    steps.push({
                        'is': [pos, elements[child]]
                    })
                    pos = child;
                    child = pos * 2 + 1;
                } else {
                    break;
                }

                elements[pos] = swap;
                steps.push({
                    'is': [pos, swap]
                })
            }
        }

        //构建堆
        function buildHeap(elements) {
            //从最后一个拥有子节点的节点开始，将该节点连同其子节点进行比较，
            //将最大的数交换与该节点,交换后，再依次向前节点进行相同交换处理，
            //直至构建出大顶堆（升序为大顶，降序为小顶）
            for (var i = elements.length / 2; i >= 0; i--) {
                headAdjust(elements, i, elements.length);
            }
        }

        function sort(elements) {
            //构建堆
            buildHeap(elements);

            //从数列的尾部开始进行调整
            for (var i = elements.length - 1; i > 0; i--) {
                //堆顶永远是最大元素，故，将堆顶和尾部元素交换，将
                //最大元素保存于尾部，并且不参与后面的调整
                var swap = elements[i];
                elements[i] = elements[0];
                elements[0] = swap;
                steps.push({
                    'swap': [i, 0]
                })

                //进行调整，将最大）元素调整至堆顶
                headAdjust(elements, 0, i);
            }
        }


        console.log('before: ' + list);
        sort(list);
        console.log(' after: ' + list);

    }


    //read steps
    function readStep(steps) {

        if (steps.length <= 0) {
            console.error("???");
            return;
        }
        const step = steps.shift();
        // console.log('in step');
        // console.log(step, step.min, step.pointer, step.swap);
        if (step.min) {
            // console.log(step.min, $scope.min, 'new min');
            $scope.min = step.min;

        } else if (step.pointer) {
            $scope.pointer = step.pointer;
            $scope.dataAccess += 1;
            $scope.comparation += 1;

        } else if (step.swap) {
            // console.log(step.swap, 'swap');
            const temp = $scope.dataSet[step.swap[0]];
            $scope.dataSet[step.swap[0]] = $scope.dataSet[step.swap[1]];
            $scope.dataSet[step.swap[1]] = temp;
            $scope.comparation += 3;
        } else if (step.sorted) {
            $scope.sorted = step.sorted;
        } else if (step.is) {
            $scope.dataSet[step.is[0]] = step.is[1];
        }


    }

    const steps = [];

    $scope.min = 'null';
    $scope.sortMethod = 'quick sort';
    $scope.comparation = 0;
    $scope.dataAccess = 0;
    $scope.dataSize = 50;
    $scope.resDataSize = 50;
    $scope.getData($scope.dataSize);

});