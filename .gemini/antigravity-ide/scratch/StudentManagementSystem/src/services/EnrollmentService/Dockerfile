FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["EnrollmentService.csproj", "./"]
RUN dotnet restore "EnrollmentService.csproj"
COPY . .
RUN dotnet publish "EnrollmentService.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:80
EXPOSE 80
ENTRYPOINT ["dotnet", "EnrollmentService.dll"]
