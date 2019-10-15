(function ($) {
    var key = 'wangshengcai_1553946484946';
    var flag = false;
    var tableData = [];
    // 分页要用
    var pageSize = 6;
    var nowPage = 1;
    var allPageSize = 0;

    /**
     * 初始化入口
     */
    function init() {
        bindEvent();
        $('.menu-list .student-list').trigger('click');
    }
    init();

    /**
     * 绑定事件
     */
    function bindEvent() {
        // 左侧学生列表点击
        $('.menu-list').on('click', 'dd', function () {
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
            var id = $(this).data('id');
            if (id == 'student-list') {
                getTableData();
            }
            $('.content').fadeOut();
            $('#' + id).fadeIn();
        });

        // 新增学生
        $('#add-student .submit').on('click', function (e) {
            e.preventDefault ? e.preventDefault() : e.returnValue = false;
            if (flag) {
                return;
            }
            flag = true;
            var dataArr = $('#add-student-form').serializeArray();
            var data = formatObj(dataArr);
            transferData('/api/student/addStudent', data, function (res) {
                var isConfirm = confirm('提交成功，是否跳转页面？');
                if (isConfirm) {
                    $('.menu-list .student-list').trigger('click');
                }
                $('#add-student-form')[0].reset();
                flag = false;
            })
        })

        // 点击编辑按钮弹出表单和遮罩层
        $('.tbody').on('click', '.edit', function () {
            var index = $(this).data('index');
            $('.right-content .dialog').slideDown();
            getDataBack(tableData[index]);
        })

        // 点击遮罩层收起表单
        $('.mask').click(function () {
            $('.right-content .dialog').slideUp();
        })

        // 点击编辑学生
        $('#edit-student-form .edit').on('click', function (e) {
            e.preventDefault ? e.preventDefault() : e.returnValue = false;
            if (flag) {
                return;
            }
            flag = true;
            var dataArr = $('#edit-student-form').serializeArray();
            var data = formatObj(dataArr);
            var isTurnPage = confirm('是否要更新数据？');
            if (isTurnPage) {
                transferData('/api/student/updateStudent', data, function (res) {
                    $('.menu-list .student-list').trigger('click');
                    $('.dialog .mask').trigger('click');
                })
            }
            $('.dialog .mask').trigger('click');
            flag = false;
        })

        // 点击删除学生
        $('.tbody').on('click', '.del', function () {
            var index = $(this).data('index');
            var isConfirm = confirm('确认删除？');
            if (isConfirm) {
                transferData('/api/student/delBySno', { sNo: tableData[index].sNo }, function (res) {
                    alert(res.msg);
                    $('.menu-list .student-list').trigger('click');
                })
            }
        })

        // 按关键字搜索学生
        $('.right-content .search .btn').on('click', function () {
            var val = $('.right-content .search .search-word').val();
            nowPage = 1;
            if (val == 'null' || val == null || val == 'undefined' || val == ' ' || val == '') {
                alert('请输入正确的关键字！');
            }
            if (val) {
                filterData(val);
            }
        })
    }

    // 获取表单里面的数据(编辑和新增)
    function formatObj(arr) {
        var obj = {};
        for (var i = 0; i < arr.length; i++) {
            if (!obj[arr[i].name]) {
                obj[arr[i].name] = arr[i].value;
            }
        }
        return obj;
    }

    // 向后台请求数据公用的部分代码
    function transferData(url, data, cb) {
        $.ajax({
            type: 'get',
            url: 'http://api.duyiedu.com' + url,
            data: $.extend(data, { appkey: key }),
            dataType: 'json',
            success: function (res) {
                if (res.status == 'success') {
                    cb(res);
                } else {
                    alert(res.msg);
                }
            },
            error: function (e) {
                console.log(e.status, e.statusText);
            }
        })
    }

    // 获取左侧全部表格数据
    function getTableData() {
        transferData('/api/student/findByPage', {
            page: nowPage,
            size: pageSize,
        }, function (res) {
            allPageSize = res.data.cont;
            tableData = res.data.findByPage;
            randerTableData(tableData);
        })
    }

    // 渲染页面
    function randerTableData(data) {
        var str = '';
        data.forEach(function (item, index) {
            str += `<tr>
                        <td>${item.sNo}</td>
                        <td>${item.name}</td>
                        <td>${item.sex ? '女' : '男'}</td>
                        <td>${item.email}</td>
                        <td>${new Date().getFullYear() - item.birth}</td>
                        <td>${item.phone}</td>
                        <td>${item.address}</td>
                        <td>
                            <button class='btn edit' data-index=${index}>编辑</button>
                            <button class='btn del' data-index=${index}>删除</button>
                        </td>
                    </tr>`;
        });
        $('.tbody').html(str);
        changePage();
    }

    // 分页部分
    function changePage() {
        $('.right-content .cubs').page({
            allPageSize: allPageSize,
            nowPage: nowPage,
            pageSize: pageSize,
            changePageCb: function (obj) {
                pageSize = obj.pageSize;
                nowPage = obj.nowPage;
                var val = $('.right-content .search .search-word').val();
                if (val) {
                    filterData(val);
                } else {
                    getTableData();
                }
            }
        })
    }

    // 表单回填
    function getDataBack(data) {
        var form = $('#edit-student-form')[0];
        for (var prop in data) {
            if (form[prop]) {
                form[prop].value = data[prop];
            }
        }
    }

    // 关键字搜索学生 数据
    function filterData(val) {
        transferData('/api/student/searchStudent', {
            sex: -1,
            search: val,
            page: nowPage,
            size: pageSize,
        }, function (res) {
            allPageSize = res.data.cont;
            console.log(res)
            setTimeout(function () {
                if(allPageSize == 0) {
                    alert('查询不到该学生');
                }
            },1200)
            var searchList = res.data.searchList;
            randerTableData(searchList);
        })
    }
}(jQuery))