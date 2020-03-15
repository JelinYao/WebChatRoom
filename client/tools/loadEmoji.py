# endcoding = utf-8
import urllib
import urllib.request
import os
import os.path
import time

#下载QQ表情包
def DownloadQQEmoji():
    try:
        count = 75
        i = 1
        while(i<=count):
            name = str(i) + ".gif"
            percent = ((i-1)*100)/count
            print("进度：%d%% 开始下载：%s"%(percent, name))
            url = "http://www.jq22.com/demo/qqFace/arclist/" + name
            data = url_request(url)
            i += 1
            if len(data) == 0:
                print("请求url: %s失败"%url)
            else:
                #保存到文件
                path = os.path.dirname(__file__) + "\\..\\img\\emoji\\" + name
                with open(path, "wb") as f:
                    f.write(data)
            #等待1秒钟再执行
            time.sleep(1)
    except Exception as e:
        print(e)
    finally:
        print("程序执行完毕")

#HTTP网络请求
def url_request(url):
    try:
        req = urllib.request.Request(url)
        req.add_header("User-Agent", "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.75 Safari/537.36")
        req.add_header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8")
        req.add_header("Accept-Language", "zh-CN,zh;q=0.8")
        response = urllib.request.urlopen(req)
    except urllib.request.HTTPError as e:
        print(e.reason)
        return ""
    except urllib.request.URLError as e:
        print(e.reason)
        return ""
    except Exception as e:
        print(e)
        return ""
    else:
        return response.read()

if __name__ == "__main__":
    print("开始下载表情文件到 ..\\img\\emoji")
    DownloadQQEmoji()

