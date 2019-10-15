(function ($) {
    /**
     * 构造工厂
     */
    function TurnPage(dom, opt) {
        // 当前实例
        this.dom = dom;
        // 全部数据
        this.allPageSize = opt.allPageSize;
        // 每页数据
        this.pageSize = opt.pageSize;
        // 当前页数
        this.nowPage = opt.nowPage;
        // 总页数
        this.allPage = Math.ceil(this.allPageSize / this.pageSize);
        // 回调函数
        this.changePageCb = opt.changePageCb;

        // 初始化函数
        if (this.nowPage > this.allPage + 1 || this.nowPage < 0) {
            alert('请输入正确的页码！');
            return;
        }
        this.createDom();
        this.bindEvent();
    }
    /**
     * 创建元素
     */
    TurnPage.prototype.createDom = function () {
        $(this.dom).empty();
        var Ul = $('<ul class="my-page"></ul>');
        $('<div class="page-size"><span>每页条数：</span><input class="size" type="number" min="1" max="50" value="' + this.pageSize + '"></input></div>').appendTo(Ul);

        // 上一页
        if (this.nowPage > 1) {
            $('<li class="prev-page">上一页</li>').appendTo(Ul);
        }
        // 第一页
        if (this.nowPage > 3) {
            $('<li class="num">1</li>').appendTo(Ul);
        }
        // 第一页省略号
        if (this.nowPage - 2 > 2) {
            $('<span>...</span>').appendTo(Ul);
        }

        // 中间循环部分
        for (var i = this.nowPage - 2; i <= this.nowPage + 2; i++) {
            if (i >= 1 && i <= this.allPage) {
                if (i == this.nowPage) {
                    $('<li class="num active">' + i + '</li>').appendTo(Ul);
                } else {
                    $('<li class="num">' + i + '</li>').appendTo(Ul);
                }
            }
        }

        // 第二页省略号
        if (this.nowPage + 2 < this.allPage - 1) {
            $('<span>...</span>').appendTo(Ul);
        }
        // 最后一页
        if (this.nowPage + 2 < this.allPage) {
            $('<li class="num">' + this.allPage + '</li>').appendTo(Ul);
        }
        // 下一页
        if (this.nowPage < this.allPage) {
            $('<li class="next-page">下一页</li>').appendTo(Ul);
        }

        // 插入页面容器
        this.dom.append(Ul);
    }

    /**
     * 绑定事件
     */
    TurnPage.prototype.bindEvent = function () {
        var that = this;
        $('.num', this.dom).on('click', function () {
            var page = parseInt($(this).text());        // 转换成数字才能方便上方的循环加加减减
            that.changeStyle(page);
        });
        $('.prev-page', this.dom).click(function () {
            that.changeStyle(that.nowPage - 1);
        });
        $('.next-page', this.dom).click(function () {
            that.changeStyle(that.nowPage + 1);
        });
        $('.size').change(function () {
            that.pageSize = parseInt($(this).val());    // 转换成数字才能方便上方的循环加加减减
            that.allPage = Math.ceil(that.allPageSize / that.pageSize);
            that.changeStyle(1);
        })
    }

    /**
     * 改变样式
     */
    TurnPage.prototype.changeStyle = function (page) {
        this.nowPage = page;
        this.createDom();
        this.bindEvent();
        this.changePageCb && this.changePageCb({
            pageSize: this.pageSize,
            nowPage: this.nowPage
        })
    }

    /**
     * 扩展一个实例方法
     */
    $.fn.extend({
        page: function (opations) {
            new TurnPage(this, opations);
        }
    })
}(jQuery));