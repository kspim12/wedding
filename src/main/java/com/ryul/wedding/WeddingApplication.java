package com.ryul.wedding;

import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.Map;

/** Dependency-free server for the invitation and its public, optimized photographs. */
public final class WeddingApplication {
    public static void main(String[] args) throws IOException {
        int port = Integer.parseInt(System.getenv().getOrDefault("PORT", "8080"));
        var server = HttpServer.create(new InetSocketAddress(port), 0);
        var types = Map.of("html", "text/html; charset=utf-8", "css", "text/css; charset=utf-8",
                "js", "text/javascript; charset=utf-8", "jpg", "image/jpeg");
        server.createContext("/", exchange -> {
            try (exchange) {
                String path = exchange.getRequestURI().getPath();
                if (path.equals("/")) path = "/index.html";
                if (!exchange.getRequestMethod().equals("GET") && !exchange.getRequestMethod().equals("HEAD")) {
                    exchange.getResponseHeaders().set("Allow", "GET, HEAD");
                    exchange.sendResponseHeaders(405, -1); return;
                }
                if (!path.matches("/(index\\.html|style\\.css|app\\.js|photos/[0-9]{2}\\.jpg)")) {
                    exchange.sendResponseHeaders(404, -1); return;
                }
                try (var input = WeddingApplication.class.getResourceAsStream("/web" + path)) {
                    if (input == null) { exchange.sendResponseHeaders(404, -1); return; }
                    byte[] body = input.readAllBytes();
                    String extension = path.substring(path.lastIndexOf('.') + 1);
                    exchange.getResponseHeaders().set("Content-Type", types.get(extension));
                    exchange.getResponseHeaders().set("X-Content-Type-Options", "nosniff");
                    exchange.getResponseHeaders().set("Cache-Control", extension.equals("jpg") ? "public, max-age=86400" : "no-cache");
                    if (exchange.getRequestMethod().equals("HEAD")) {
                        exchange.getResponseHeaders().set("Content-Length", Integer.toString(body.length));
                        exchange.sendResponseHeaders(200, -1);
                    } else {
                        exchange.sendResponseHeaders(200, body.length);
                        exchange.getResponseBody().write(body);
                    }
                }
            }
        });
        server.start();
        System.out.println("Wedding invitation: http://localhost:" + port);
    }
}
