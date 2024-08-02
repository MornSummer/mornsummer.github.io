if(1) {
    fetch('https://mornmemos.zeabur.app/api/v1/memo?creatorId=1&tag=说说&limit=30').then(res => res.json()).then(data => { //修改为你的memos地址
        let items = [],
            html = '',
            icon = '<svg viewBox="0 0 512 512"xmlns="http://www.w3.org/2000/svg"class="is-badge icon"><path d="m512 268c0 17.9-4.3 34.5-12.9 49.7s-20.1 27.1-34.6 35.4c.4 2.7.6 6.9.6 12.6 0 27.1-9.1 50.1-27.1 69.1-18.1 19.1-39.9 28.6-65.4 28.6-11.4 0-22.3-2.1-32.6-6.3-8 16.4-19.5 29.6-34.6 39.7-15 10.2-31.5 15.2-49.4 15.2-18.3 0-34.9-4.9-49.7-14.9-14.9-9.9-26.3-23.2-34.3-40-10.3 4.2-21.1 6.3-32.6 6.3-25.5 0-47.4-9.5-65.7-28.6-18.3-19-27.4-42.1-27.4-69.1 0-3 .4-7.2 1.1-12.6-14.5-8.4-26-20.2-34.6-35.4-8.5-15.2-12.8-31.8-12.8-49.7 0-19 4.8-36.5 14.3-52.3s22.3-27.5 38.3-35.1c-4.2-11.4-6.3-22.9-6.3-34.3 0-27 9.1-50.1 27.4-69.1s40.2-28.6 65.7-28.6c11.4 0 22.3 2.1 32.6 6.3 8-16.4 19.5-29.6 34.6-39.7 15-10.1 31.5-15.2 49.4-15.2s34.4 5.1 49.4 15.1c15 10.1 26.6 23.3 34.6 39.7 10.3-4.2 21.1-6.3 32.6-6.3 25.5 0 47.3 9.5 65.4 28.6s27.1 42.1 27.1 69.1c0 12.6-1.9 24-5.7 34.3 16 7.6 28.8 19.3 38.3 35.1 9.5 15.9 14.3 33.4 14.3 52.4zm-266.9 77.1 105.7-158.3c2.7-4.2 3.5-8.8 2.6-13.7-1-4.9-3.5-8.8-7.7-11.4-4.2-2.7-8.8-3.6-13.7-2.9-5 .8-9 3.2-12 7.4l-93.1 140-42.9-42.8c-3.8-3.8-8.2-5.6-13.1-5.4-5 .2-9.3 2-13.1 5.4-3.4 3.4-5.1 7.7-5.1 12.9 0 5.1 1.7 9.4 5.1 12.9l58.9 58.9 2.9 2.3c3.4 2.3 6.9 3.4 10.3 3.4 6.7-.1 11.8-2.9 15.2-8.7z"fill="#1da1f2"></path></svg>';
        data.forEach(item => { items.push(Format(item)) });
        if (items.length == 30) document.querySelector('.limit').style.display = 'block';
        items.forEach(item => {
            html += `
            <div class="talk_item">
                <div class="talk_meta">
                    <img class="nolazyload avatar" src="https://pic.imgdb.cn/item/663618d30ea9cb1403f5dda4.webp">
                    <div class="info">
                        <span class="talk_nick">${item.avatar}${icon}</span>
                        <span class="talk_date">${item.date}</span>
                    </div>
                </div>
                <div class="talk_content">${item.content}</div>
                <div class="talk_bottom">
                    <div>
                        <span class="talk_tag"># ${item.tag}</span>
                    </div>
                    <a href="javascript:;"onclick="goComment('${item.text}')">
                        <span class="icon">
                            <i class="anzhiyufont anzhiyu-icon-message"></i>
                        </span>
                    </a>
                </div>
            </div>`
        })
        document.getElementById('talk').innerHTML = html
        var elem = document.querySelector('#talk');
        var containerTalkWidth = document.querySelector('.card-content').offsetWidth;
        var containerelemWidth = document.querySelector('.talk_item').offsetWidth;
        var isMobile = window.matchMedia("(max-width: 768px)").matches;
        if (!isMobile) {
            var msnry = new Masonry( elem, {
                // options
                itemSelector: '.talk_item',
                columnWidth: '.talk_item',
                gutter: (containerTalkWidth - containerelemWidth*3)/2,
                percentPosition: true,
                fitWidth: true
            });
        }
    })
    // 页面评论
    function goComment(e) {
        var n = document.querySelector(".el-textarea__inner")
        n.value = `> ${e}\n\n`;
        n.focus();
        var element = document.querySelector('#post-comment .comment-tips').style.display = 'block';
    }
    // 页面内容格式化
    function Format(item) {
        let date = getTime(new Date(item.createdTs * 1000).toString()),
        content = item.content,
        userId = item.creatorUsername,
        avatar = item.creatorName,
        tag = item.content.match(/\{((?!bilibili|music|video).)*?\}/g),
        imgs = content.match(/!\[.*\]\(.*?\)/g), 
        bilibili = content.match(/\{\s*bilibili (.*?)\}/g);
        video = content.match(/\{\s*video (.*?)\}/g);
        music = content.match(/\{\s*music (.*?)\}/g);
        text = ''
        if (imgs) imgs = imgs.map(item => { return item.replace(/!\[.*\]\((.*?)\)/, '$1') })
        if (bilibili) bilibili = bilibili.map(item => { return item.replace(/\{\s*bilibili (.*?)\}/, '$1') })
        if (video) video = video.map(item => { return item.replace(/\{\s*video (.*?)\}/, '$1') })
        if (music) music = music.map(item => { return item.replace(/\{\s*music (.*?)\}/, '$1') })
        if (item.resourceList.length) {
            if (!imgs) imgs = []
            item.resourceList.forEach(t => {
                if (t.externalLink) imgs.push(t.externalLink)
                else imgs.push(`${url}/o/r/${t.id}/${t.publicId}/${t.filename}`)
            })
        }
        text = content.replace(/#(.*?)\s/g, '').replace(/\!\[(.*?)\]\((.*?)\)/g,'').replace(/\{(.*?)\}/g, '').trimEnd()
        content = text.replace(/\[(.*?)\]\((.*?)\)/g, `<a href="$2" target="_blank">@$1</a>`);
        if (imgs) {
            content += `<div class="zone_imgbox">`
            imgs.forEach(e => {
                    content += `<a href="${e}" data-fancybox="gallery" class="fancybox" data-thumb="${e}"><img class="nolazyload" src="${e}"></a>` 
                    text += ` [图片]`
            })
            content += '</div>'
        }
        if (bilibili) {
            content += `<div style='margin-top: 10px; margin-bottom: 10px'>`
            bilibili.forEach(e => {
                content += `<div style='position: relative; padding: 30% 45%; margin-bottom: 10px'><iframe style='position: absolute; width: 100%; height: 100%; left: 0; top: 0;' src="https://player.bilibili.com/player.html?autoplay=0&bvid=${e}" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe></div>`
                text += ` [B站视频]`
            })
            content += '</div>'
        }
        if (video) {
            content += `<div style='margin-top: 10px; margin-bottom: 10px'>`
            video.forEach(e => {
                content += `<div style='position: relative; padding: 30% 45%; margin-bottom: 10px'><video style='position: absolute; width: 100%; height: 100%; left: 0; top: 0;' src="${e}" controls="controls" preload="auto" width="100%" height="100%"></video></div>`
                text += ` [视频]`
            })
            content += '</div>'
        }
        if (music) {
            content += `<div style='margin-top: 10px; margin-bottom: 10px;height:90px'>`
            music.forEach(e => {
                content += `<meting-js auto="${e}"></meting-js>`
                text += ` [音乐]`
            })
            content += '</div>'
        }
        return {
            content: content,
            avatar: avatar,
            userId: userId,
            tag: tag ? tag[0].replace(/\{(.*?)\}/,'$1') : '无标签',
            date: date,
            text: text.replace(/\[(.*?)\]\((.*?)\)/g, '[链接]')
        }
    }
    // 页面时间格式化
    function getTime(time) {
        let d = new Date(time),
            ls = [d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds()];
        for (let i = 0; i < ls.length; i++) {
            ls[i] = ls[i] <= 9 ? '0' + ls[i] : ls[i] + ''
        }
        if (new Date().getFullYear() == ls[0]) return ls[1] + '月' + ls[2] + '日 ' + ls[3] +':'+ ls[4]
        else return ls[0] + '年' + ls[1] + '月' + ls[2] + '日 ' + ls[3] +':'+ ls[4]
    }
}