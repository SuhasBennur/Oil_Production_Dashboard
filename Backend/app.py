from Core.Config import create_app
from Core.Excel_Utils import init_excel
from Routez import History, Analytics
from Sockets.Oil_Stream import oil_stream

app = create_app()
init_excel()

# Include routers
app.include_router(History.router)
app.include_router(Analytics.router)

# WebSocket route
app.websocket("/ws/oil")(oil_stream)