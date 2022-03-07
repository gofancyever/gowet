from mitmproxy import http
from mitmproxy import ctx
import re

def ip_exist(one_url):
    compile_rule = re.compile(r'(?<![\.\d])(?:\d{1,3}\.){3}\d{1,3}(?![\.\d])')
    match_list = re.findall(compile_rule, one_url)
    if match_list:
        return True
    else:
        return False

def request(flow: http.HTTPFlow):
    # redirect to different host
    print(flow.request.headers['User-Agent'])
    print("====have env:",'requestEnv' in flow.request.headers['User-Agent'])
    if 'requestEnv' in flow.request.headers['User-Agent'] and '/#/' not in flow.request.url and flow.request.method == 'POST':
        ctx.log.alert("url======")
        ctx.log.alert(flow.request.url)
        ctx.log.alert(flow.request.method)
        if "weixin.sxyygh.com" in flow.request.host or ip_exist(flow.request.host) or "uhapi.sxyygh.com" in flow.request.host:
            ctx.log.alert("转入代理===>")
            flow.request.host = "192.168.1.201"
            flow.request.port = 8028
            flow.request.scheme = 'http'
