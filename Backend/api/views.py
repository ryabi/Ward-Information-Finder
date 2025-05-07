from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from .serializers import candidateSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from .permissions import IsAdminOrReadOnly
from .models import Candidates,Ward,Province,Municipality,District
from rest_framework import status
# Create your views here.

class Candidate(APIView):
    permission_classes=[IsAdminOrReadOnly]
    def post(self,request):
        candidate=request.data
        serializer=candidateSerializer(data=candidate)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(data=serializer.data)
        else :
            return Response(data=serializer.errors,status=401)  
    
    def delete(self,request,pk):
        try:
            candidate = Candidates.objects.get(pk=pk)
        except Candidates.DoesNotExist:
            return Response({'error': 'Candidate not found'}, status=status.HTTP_404_NOT_FOUND)
        candidate.delete()
        return Response({'message': 'Candidate deleted'}, status=status.HTTP_204_NO_CONTENT)
       
    def get(self,request):
        province=request.query_params.get('province')
        district=request.query_params.get('district')
        municipality=request.query_params.get('municipality')
        ward_no=request.query_params.get('ward_no')
        query_sets=Candidates.objects.filter(
          ward__municipality__district__province__name=province,
                ward__municipality__district__name=district,
                ward__municipality__name=municipality,
                ward__ward_no=ward_no
            ).select_related('ward__municipality__district__province')
        
        # print(query_sets.query)
        # for candidate in query_sets:
        #     print(candidate.ward.ward_no)
        serializer=candidateSerializer(query_sets,many=True)
       
        return Response(serializer.data,status=status.HTTP_200_OK)
      
            
        
            
            