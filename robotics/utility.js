function writeConsole(content) {
    top.consoleRef=window.open('','myconsole',
            'width=350,height=550'
            +',menubar=0'
            +',toolbar=1'
            +',status=0'
            +',scrollbars=1'
            +',resizable=1')
        top.consoleRef.document.writeln(
                '<html><head><title>Console</title></head>'
                +content.join( '<br/>' )
                +'</body></html>'
                )
        top.consoleRef.document.close()
}

