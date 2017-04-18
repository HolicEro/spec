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
        const list = [];

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
                heapsort(list, steps);
                break;
            default:
                console.error('sort method error');
        }

        $scope.dataAccess = 0;
        $scope.comparation = 0;

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
                    pointer: j
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

    }

    const heapsort = function(list, steps) {

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
    $scope.sortMethod = 'selection sort';
    $scope.comparation = 0;
    $scope.dataAccess = 0;
    $scope.dataSize = 50;
    $scope.resDataSize = 50;
    $scope.getData($scope.dataSize);

});