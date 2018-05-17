"use strict";

var dappAddress = "n1w1VwdkHvuUorpmTifsHmH8VJBnXaNmtra";
var hash = "0d8f7d5178456a84463cc37dc6d9f96ff34daf347f7e6339504a8bf72ffb0695";
var NebPay = require("nebpay");
var nebPay = new NebPay();

if (typeof webExtensionWallet === "undefined") {
  toast('星云钱包环境未运行，请安装钱包插件')
}

/*** 导航切换 ***/
$('#nav-input').on('click', function () {
  $('#nav-input').addClass('active');
  $('#nav-search').removeClass('active');
  $('#add').show();
  $('#search').hide();
})

$('#nav-search').on('click', function () {
  $('#nav-search').addClass('active');
  $('#nav-input').removeClass('active');
  $('#add').hide();
  $('#search').show();
})

/*** toast封装 ***/
function toast (text) {
  $('#toast').html(text);
  $('#toast').show();
  setTimeout(function () {
    $('#toast').addClass('toast-show');
    showToast()
  }, 300);
}

function showToast () {
  setTimeout(function () {
    $('#toast').removeClass('toast-show');
    setTimeout(function () {
      $('#toast').hide();
    }, 2300);
  }, 3000);
}

/*** tloading封装 ***/
function loading (type) {
  if (type) {
    $('#loading').show();
  } else {
    $('#loading').hide();
  }
}

/*** 添加信息逻辑 ***/
$('#add-submit').on('click', function () {
  if (!$('#add-date').val()) {
    toast('请选择出生年月日');
    return false
  }
  if (!$('#add-email').val()) {
    toast('请输入联系邮箱');
    return false
  }
  loading(true);
  setInformation($('#add-date').val(), $('#add-email').val())
})

/*** 添加信息和智能合约交互 ***/
function setInformation (birthday, email) {
  nebPay.call(dappAddress, "0", "set", JSON.stringify([birthday, email]), { 
    listener: function(res){
      loading(false);
      if (res.txhash) {
        toast('信息添加成功,1分钟后可查询信息')
      }
    }
  })
}

/*** 查询信息逻辑 ***/
$('#search-input').on('click', function () {
  if (!$('#search-date').val()) {
    toast('请选择出生年月日');
    return false
  }
  loading(true);
  getInformation($('#search-date').val());
})

/*** 查询信息和智能合约交互 ***/
function getInformation (birthday) {
  nebPay.simulateCall(dappAddress, "0", "get", JSON.stringify([birthday]), {
    listener: function(res) {
      loading(false);
      if(res.result == '' && res.execute_err == 'contract check failed') {
          toast('合约检测失败，请检查浏览器钱包插件环境！');
          return;
      }

      var datalist = JSON.parse(res.result);
      renderSearch(datalist)
    }
  })
}

/*** 渲染查询出来的逻辑 ***/
function renderSearch (data) {
  var html = '';
  var datalist = JSON.parse(data);
  if (datalist && datalist.length) {
    for (var i = 0; i < datalist.length; i++) {
      html += '<div class="search-result-item">'
          +'<span class="search-result-birthday">' + datalist[i].key + '</span>'
          +'<span class="search-result-email">联系邮箱: ' + datalist[i].value + '</span>'
        +'</div>'
    }
  } else {
    html += '<div class="search-result-item">暂无.同年同月同日为小概率事件.请转发本网站方便别的小朋友寻找同年同月同日小伙伴</div>'
  }
  $('#search-result').html(html);
}
