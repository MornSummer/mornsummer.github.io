var posts=["2023/03/19/“bilibiliUP主推荐”/","2023/03/17/“第一篇文章”/","2023/03/18/win11预览频道加入及更新方法/","2023/03/26/网站使用指南/","2023/03/26/网站意见问卷调查/","2023/03/26/更新日志/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };